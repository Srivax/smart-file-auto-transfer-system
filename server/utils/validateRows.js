export const validateRows = (rows) => {
  const valid = [];
  const invalid = [];

  rows.forEach((r, i) => {
    const name = String(r.Name || "").trim();
    const roll = String(r.Roll || "").trim();
    const subject = String(r.Subject || "").trim();
    const marks = Number(r.Marks);

    if (!name || !roll || !subject || Number.isNaN(marks)) {
      invalid.push({ row: i + 2, issue: "Empty or invalid fields" });
    } else if (marks < 0 || marks > 100) {
      invalid.push({ row: i + 2, issue: "Marks out of range (0–100)" });
    } else {
      valid.push({ name, roll, subject, marks });
    }
  });

  return { valid, invalid };
};
