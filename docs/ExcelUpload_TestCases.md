
# Test Cases for Uploading Excel File


## 1. Test Cases Table

### File Upload & Header Validation (TC-001 to TC-018)

| ID         | Scenario               | Expected Result                | Status  |
| ---------- | ---------------------- | ------------------------------ | ------- |
| **TC-001** | Valid file upload      | 200, 5 rows inserted           | Pending |
| **TC-002** | No file uploaded       | 400, "No file uploaded"        | Pending |
| **TC-003** | Wrong Content-Type     | 400, "Use multipart/form-data" | Pending |
| **TC-004** | Invalid `.xls` file    | 400                            | Pending |
| **TC-005** | Invalid `.csv` file    | 400                            | Pending |
| **TC-006** | Invalid `.pdf` file    | 400                            | Pending |
| **TC-007** | Invalid `.txt` file    | 400                            | Pending |
| **TC-008** | File > 2MB             | 413 or 400                     | Pending |
| **TC-009** | File = 2MB             | 200                            | Pending |
| **TC-010** | No sheets              | 400, "No sheet found"          | Pending |
| **TC-011** | Header only, no rows   | 400                            | Pending |
| **TC-012** | Missing Name header    | 400                            | Pending |
| **TC-013** | Missing Roll header    | 400                            | Pending |
| **TC-014** | Missing Subject header | 400                            | Pending |
| **TC-015** | Missing Marks header   | 400                            | Pending |
| **TC-016** | All lowercase headers  | 400                            | Pending |
| **TC-017** | Typo in header         | 400                            | Pending |
| **TC-018** | Extra columns          | 200, extra ignored             | Pending |

---

### Row & Field Validation (TC-019 to TC-053)

| ID         | Scenario                     | Expected Result    | Status  |
| ---------- | ---------------------------- | ------------------ | ------- |
| **TC-019** | Empty Name                   | invalid: 1         | Pending |
| **TC-020** | Empty Roll                   | invalid: 1         | Pending |
| **TC-021** | Empty Subject                | invalid: 1         | Pending |
| **TC-022** | Empty Marks                  | invalid: 1         | Pending |
| **TC-023** | Marks = "ABC"                | invalid            | Pending |
| **TC-024** | Marks = "85 marks"           | invalid            | Pending |
| **TC-025** | Marks = 0                    | valid              | Pending |
| **TC-026** | Marks = 100                  | valid              | Pending |
| **TC-027** | Marks < 0                    | invalid            | Pending |
| **TC-028** | Marks > 100                  | invalid            | Pending |
| **TC-029** | Marks = 85.5                 | valid              | Pending |
| **TC-030** | Marks = 0.1                  | valid              | Pending |
| **TC-031** | Marks = 99.9                 | valid              | Pending |
| **TC-032** | 10 valid rows                | 200, inserted:10   | Pending |
| **TC-033** | All 5 rows invalid           | 400                | Pending |
| **TC-034** | Mixed rows                   | 200, some invalid  | Pending |
| **TC-035** | Name = spaces                | invalid            | Pending |
| **TC-036** | Roll = spaces                | invalid            | Pending |
| **TC-037** | Subject = spaces             | invalid            | Pending |
| **TC-038** | Name with spaces             | trimmed → valid    | Pending |
| **TC-039** | 10 invalid rows              | 400                | Pending |
| **TC-040** | 1000+ valid rows             | 200                | Pending |
| **TC-041** | Marks = null                 | invalid            | Pending |
| **TC-042** | Marks empty                  | invalid            | Pending |
| **TC-043** | Marks = "085"                | valid              | Pending |
| **TC-044** | Marks = "0"                  | valid              | Pending |
| **TC-045** | Marks = "100"                | valid              | Pending |
| **TC-046** | All fields empty             | invalid            | Pending |
| **TC-047** | Name with special characters | valid              | Pending |
| **TC-048** | Roll = numeric string        | valid              | Pending |
| **TC-049** | Roll = alphanumeric          | valid              | Pending |
| **TC-050** | DB check after upload        | All inserted       | Pending |
| **TC-051** | Validate response JSON       | All fields present | Pending |
| **TC-052** | Temp file deleted (success)  | file removed       | Pending |
| **TC-053** | Temp file deleted (error)    | file removed       | Pending |

---

### Edge Cases & Special Scenarios (TC-054 to TC-070)

| ID         | Scenario                  | Expected Result        | Status  |
| ---------- | ------------------------- | ---------------------- | ------- |
| **TC-054** | Concurrent uploads        | All succeed            | Pending |
| **TC-055** | Marks = "1e2"             | valid                  | Pending |
| **TC-056** | Marks = Infinity          | invalid                | Pending |
| **TC-057** | Marks = -Infinity         | invalid                | Pending |
| **TC-058** | Marks = NaN               | invalid                | Pending |
| **TC-059** | Very long Name            | valid                  | Pending |
| **TC-060** | Very long Subject         | valid                  | Pending |
| **TC-061** | Marks = 0.001             | valid                  | Pending |
| **TC-062** | Marks = 99.999            | valid                  | Pending |
| **TC-063** | Multiple sheets           | Only first sheet used  | Pending |
| **TC-064** | Header row + 1 empty row  | invalid                | Pending |
| **TC-065** | Marks = false             | invalid                | Pending |
| **TC-066** | Marks = true              | invalid                | Pending |
| **TC-067** | Marks = -0                | valid                  | Pending |
| **TC-068** | Marks = 6-decimal decimal | valid                  | Pending |
| **TC-069** | Row order preserved       | order maintained       | Pending |
| **TC-070** | Different invalid types   | invalid:4 , inserted:1 | Pending |

---

## 2. Test Summary

* **Total Test Cases:** 70
* **Categories:**

  * File upload validation
  * Header and structure validation
  * Row and field validation
  * Edge cases and performance


