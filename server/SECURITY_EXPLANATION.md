# Security Concepts: Filename Sanitization & MIME Spoofing

## 🔒 Filename Sanitization

### What is Filename Sanitization?
Filename sanitization is the process of cleaning and validating user-provided filenames to prevent security vulnerabilities before saving files to the server.

### Why is it Necessary?

#### 1. **Path Traversal Attacks (Directory Traversal)**
An attacker could upload a file with a malicious filename that attempts to escape the intended upload directory.

**Example Attack:**
```
Original filename: "../../../etc/passwd"
Without sanitization: File saved to /etc/passwd (overwrites system file!)
With sanitization: "passwd" (safe, relative path removed)
```

**How it works:**
- Attacker sends: `../../../etc/passwd.xlsx`
- Your code saves to: `uploads/../../../etc/passwd.xlsx`
- System resolves to: `/etc/passwd.xlsx` (outside uploads folder!)
- Result: System file overwritten or sensitive data exposed

#### 2. **Special Character Issues**
Filenames with special characters can cause:
- Filesystem errors
- Script injection (if filename is used in shell commands)
- Database injection (if filename stored in DB)
- Cross-platform compatibility issues

**Dangerous Characters:**
- `../` - Path traversal
- `\` - Windows path separator (can escape)
- `\0` - Null byte (can terminate strings early)
- `< > : " | ? *` - Invalid in Windows filenames
- Control characters - Can break scripts

#### 3. **Length Limitations**
Very long filenames can:
- Cause filesystem errors
- Crash applications
- Exceed database column limits

### How Our Sanitization Works

```javascript
const sanitizeFilename = (originalname) => {
  // Step 1: Extract basename (removes path components)
  // Input: "../../../malicious/../../file.xlsx"
  // Output: "file.xlsx"
  const basename = path.basename(originalname);
  
  // Step 2: Remove dangerous characters
  // Keep only: letters, numbers, dots, underscores, hyphens, spaces
  // Input: "file<script>.xlsx"
  // Output: "file_script_.xlsx"
  const sanitized = basename.replace(/[^a-zA-Z0-9._\s-]/g, "_");
  
  // Step 3: Limit length (prevent filesystem issues)
  // If filename > 255 chars, truncate it
  // Preserves extension, limits base name
  // ...
};
```

**Before & After Examples:**

| Original Filename | Sanitized Result | Threat Prevented |
|------------------|------------------|------------------|
| `../../../etc/passwd.xlsx` | `passwd.xlsx` | Path traversal |
| `file<script>.xlsx` | `file_script_.xlsx` | XSS/Script injection |
| `file\x00name.xlsx` | `file_name.xlsx` | Null byte injection |
| `file*.xlsx` | `file_.xlsx` | Filesystem error |
| `A` x 300 times + `.xlsx` | Truncated to 255 chars | Overflow attack |

---

## 🎭 MIME Type Spoofing

### What is MIME Type Spoofing?
MIME type spoofing occurs when a malicious file has a fake MIME type that doesn't match its actual content. The browser/client reports one file type, but the actual file is something else.

### The Problem: Trusting MIME Type Alone

**Example Attack Scenario:**

```javascript
// ❌ VULNERABLE CODE (Only checks MIME type)
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
    return cb(null, true); // Accept file
  }
  cb(new Error("Only .xlsx files allowed"));
};
```

**How an attacker bypasses this:**

1. Attacker creates a malicious JavaScript file: `malware.js`
2. Renames it to: `malware.xlsx`
3. Uses tools to fake MIME type header
4. Server sees MIME type as: `application/vnd...spreadsheetml.sheet` ✅
5. Server accepts file ✅
6. **Actual file content is still JavaScript!** ❌

**Real-World Attack:**

```bash
# Attacker's file: malware.js (JavaScript code)
echo "console.log('Stealing data...')" > malware.js

# Rename extension to .xlsx
mv malware.js malware.xlsx

# Using curl, set fake Content-Type header
curl -X POST \
  -H "Content-Type: multipart/form-data" \
  -F "file=@malware.xlsx;type=application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" \
  http://yourserver.com/api/upload

# Server receives:
# - filename: "malware.xlsx" ✅ (looks legitimate)
# - mimetype: "application/vnd...spreadsheetml.sheet" ✅ (looks legitimate)
# - actual content: JavaScript code ❌ (DANGEROUS!)
```

### Defense in Depth Strategy

**✅ CORRECT: Validate Both MIME Type AND File Extension**

```javascript
const fileFilter = (req, file, cb) => {
  // Defense Layer 1: Check MIME type (from HTTP header)
  if (file.mimetype !== XLSX_MIME_TYPE) {
    return cb(new Error("Invalid MIME type"), false);
  }

  // Defense Layer 2: Check file extension (from filename)
  // This catches files where extension was changed but MIME header faked
  const fileExtension = path.extname(file.originalname).toLowerCase();
  if (fileExtension !== ".xlsx") {
    return cb(new Error("Invalid file extension"), false);
  }

  // Defense Layer 3: (Recommended) Validate actual file content
  // Check file magic bytes/signature to verify it's truly an Excel file
  // This is the strongest defense but requires file reading
  
  cb(null, true);
};
```

### Additional Defense: Magic Byte Validation

For even stronger security, validate the file's actual content (magic bytes/signature):

```javascript
import fs from 'fs';

// Excel files (.xlsx) start with specific bytes: PK (ZIP signature)
// .xlsx files are actually ZIP archives containing XML files
const validateFileContent = async (filePath) => {
  const buffer = Buffer.alloc(4);
  const fd = fs.openSync(filePath, 'r');
  fs.readSync(fd, buffer, 0, 4, 0);
  fs.closeSync(fd);
  
  // Excel .xlsx files start with "PK" (ZIP signature)
  // First 4 bytes should be: 50 4B 03 04 (PK..)
  if (buffer[0] === 0x50 && buffer[1] === 0x4B) {
    return true; // Likely a ZIP-based Office file (.xlsx)
  }
  return false; // Not a valid Excel file
};
```

**Magic Bytes Reference:**
- `.xlsx` files: Start with `PK` (50 4B) - they're ZIP archives
- `.docx` files: Also start with `PK` (ZIP-based Office format)
- `.pdf` files: Start with `%PDF`
- `.jpg` files: Start with `FF D8 FF`
- `.png` files: Start with `89 50 4E 47`

### Comparison: Defense Levels

| Defense Layer | What It Checks | Can Be Spoofed? | Reliability |
|--------------|----------------|-----------------|-------------|
| MIME Type Only | HTTP Content-Type header | ✅ Yes (very easy) | ⚠️ Low |
| File Extension | Filename extension (.xlsx) | ✅ Yes (can rename file) | ⚠️ Medium |
| **Both MIME + Extension** | Header AND filename | ❌ Harder (needs both to match) | ✅ Good |
| Magic Bytes | Actual file content bytes | ❌ Very difficult | ✅✅ Excellent |

---

## 🔐 Security Best Practices Summary

### For Filename Sanitization:
1. ✅ Use `path.basename()` to remove path components
2. ✅ Whitelist allowed characters (don't blacklist)
3. ✅ Limit filename length
4. ✅ Preserve safe extensions
5. ✅ Generate unique filenames (add timestamp/UUID)

### For File Upload Security:
1. ✅ **Multiple Validation Layers** (Defense in Depth)
   - MIME type validation
   - File extension validation
   - File size limits
   - Magic byte validation (optional but recommended)

2. ✅ **Never Trust User Input**
   - Always validate and sanitize
   - Assume headers can be faked
   - Verify actual file content when possible

3. ✅ **Secure Storage**
   - Save files outside web root
   - Use unique filenames
   - Store in isolated directories
   - Set proper file permissions

4. ✅ **Error Handling**
   - Don't reveal filesystem structure in errors
   - Log security violations
   - Return generic error messages to users

---

## 📝 Example: Complete Secure Upload Flow

```javascript
// 1. Sanitize filename (prevent path traversal)
const sanitized = sanitizeFilename(file.originalname);

// 2. Validate MIME type (first layer)
if (file.mimetype !== allowedMimeType) {
  throw new Error("Invalid file type");
}

// 3. Validate extension (second layer)
if (path.extname(sanitized) !== allowedExtension) {
  throw new Error("Invalid file extension");
}

// 4. Save file with sanitized name
const safeFilename = `${Date.now()}-${sanitized}`;
await saveFile(file, safeFilename);

// 5. (Optional) Validate actual content
const isValidContent = await validateFileContent(file.path);
if (!isValidContent) {
  await deleteFile(file.path);
  throw new Error("File content validation failed");
}
```

---

## 🎯 Takeaways

1. **Filename Sanitization** = Protecting against malicious filenames that could:
   - Escape directories (path traversal)
   - Contain dangerous characters
   - Cause system errors

2. **MIME Spoofing** = Files that claim to be one type but are actually another
   - Always validate file extension in addition to MIME type
   - Consider validating actual file content (magic bytes)
   - Never trust user-provided headers alone

3. **Defense in Depth** = Multiple security layers
   - The more layers, the harder to bypass
   - Never rely on a single validation method

