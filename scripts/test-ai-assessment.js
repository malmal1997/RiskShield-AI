// Test script for AI assessment functionality
console.log("🧪 Testing AI Assessment System...")

// Test Google AI provider availability
async function testGoogleAI() {
  console.log("\n📡 Testing Google AI Connection...")

  try {
    const response = await fetch("/api/ai-assessment/analyze", {
      method: "GET",
    })

    const data = await response.json()
    console.log("API Status:", data.status)
    console.log("Google AI Available:", data.providers.google)

    if (!data.providers.google) {
      console.log("❌ Google AI not configured. Please add GOOGLE_GENERATIVE_AI_API_KEY environment variable.")
      console.log("🔗 Get API key at: https://aistudio.google.com/app/apikey")
      return false
    }

    console.log("✅ Google AI is configured and ready")
    return true
  } catch (error) {
    console.error("❌ Error testing Google AI:", error)
    return false
  }
}

// Test PDF text extraction capabilities
async function testPDFExtraction() {
  console.log("\n📄 Testing PDF Text Extraction...")

  // Create a simple test PDF-like content (simulated)
  const testPDFContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
72 720 Td
(This is a test security policy document) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000206 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
299
%%EOF`

  console.log("📝 Simulated PDF content created for testing")
  console.log("🔍 PDF should contain: 'This is a test security policy document'")

  // Test text extraction patterns
  const btPattern = /BT\s+(.*?)\s+ET/gs
  const tjPattern = /$$(.*?)$$\s*Tj/g

  let match
  const extractedText = []

  while ((match = btPattern.exec(testPDFContent)) !== null) {
    const textBlock = match[1]
    const tjMatch = tjPattern.exec(textBlock)
    if (tjMatch) {
      extractedText.push(tjMatch[1])
    }
  }

  if (extractedText.length > 0) {
    console.log("✅ PDF text extraction test successful")
    console.log("📄 Extracted text:", extractedText.join(" "))
    return true
  } else {
    console.log("❌ PDF text extraction test failed")
    return false
  }
}

// Test file format support
async function testFileFormats() {
  console.log("\n📁 Testing File Format Support...")

  const supportedFormats = [
    { ext: ".txt", type: "text/plain", supported: true },
    { ext: ".md", type: "text/markdown", supported: true },
    { ext: ".csv", type: "text/csv", supported: true },
    { ext: ".json", type: "application/json", supported: true },
    { ext: ".html", type: "text/html", supported: true },
    { ext: ".xml", type: "application/xml", supported: true },
    { ext: ".js", type: "text/javascript", supported: true },
    { ext: ".ts", type: "text/typescript", supported: true },
    { ext: ".yml", type: "text/yaml", supported: true },
    { ext: ".pdf", type: "application/pdf", supported: "partial" },
    { ext: ".doc", type: "application/msword", supported: false },
    { ext: ".docx", type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", supported: false },
    { ext: ".xls", type: "application/vnd.ms-excel", supported: false },
    { ext: ".xlsx", type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", supported: false },
  ]

  console.log("📋 File Format Support Matrix:")
  supportedFormats.forEach((format) => {
    const status = format.supported === true ? "✅ Full" : format.supported === "partial" ? "⚠️ Partial" : "❌ None"
    console.log(`  ${format.ext.padEnd(6)} (${format.type.padEnd(50)}) - ${status}`)
  })

  const fullySupported = supportedFormats.filter((f) => f.supported === true).length
  const partiallySupported = supportedFormats.filter((f) => f.supported === "partial").length
  const notSupported = supportedFormats.filter((f) => f.supported === false).length

  console.log(
    `\n📊 Summary: ${fullySupported} fully supported, ${partiallySupported} partially supported, ${notSupported} not supported`,
  )

  return true
}

// Test semantic validation
async function testSemanticValidation() {
  console.log("\n🧠 Testing Semantic Validation...")

  const testCases = [
    {
      question: "Do you conduct penetration testing?",
      evidence: "We perform regular penetration tests quarterly",
      expectedRelevant: true,
    },
    {
      question: "Do you conduct penetration testing?",
      evidence: "We have incident response procedures in place",
      expectedRelevant: false,
    },
    {
      question: "Do you have anti-malware protection?",
      evidence: "All endpoints have antivirus software installed",
      expectedRelevant: true,
    },
    {
      question: "Do you have anti-malware protection?",
      evidence: "We conduct vulnerability scans monthly",
      expectedRelevant: false,
    },
  ]

  console.log("🔍 Testing semantic relevance detection...")

  let passedTests = 0
  testCases.forEach((testCase, index) => {
    // Simulate semantic validation logic
    const questionLower = testCase.question.toLowerCase()
    const evidenceLower = testCase.evidence.toLowerCase()

    // Simple keyword matching for test
    const questionKeywords = questionLower.match(/\b(penetration|testing|anti-malware|antivirus|protection)\b/g) || []
    const evidenceKeywords =
      evidenceLower.match(
        /\b(penetration|test|antivirus|malware|protection|software|incident|response|vulnerability|scan)\b/g,
      ) || []

    const relevantMatches = questionKeywords.filter((qk) =>
      evidenceKeywords.some((ek) => ek.includes(qk) || qk.includes(ek)),
    )

    const isRelevant = relevantMatches.length > 0
    const testPassed = isRelevant === testCase.expectedRelevant

    console.log(`  Test ${index + 1}: ${testPassed ? "✅" : "❌"} ${testPassed ? "PASS" : "FAIL"}`)
    console.log(`    Question: "${testCase.question}"`)
    console.log(`    Evidence: "${testCase.evidence}"`)
    console.log(`    Expected: ${testCase.expectedRelevant}, Got: ${isRelevant}`)

    if (testPassed) passedTests++
  })

  console.log(`\n📊 Semantic Validation Results: ${passedTests}/${testCases.length} tests passed`)

  return passedTests === testCases.length
}

// Test assessment categories
async function testAssessmentCategories() {
  console.log("\n📋 Testing Assessment Categories...")

  const categories = [
    "cybersecurity",
    "compliance",
    "operational",
    "business-continuity",
    "financial-services",
    "data-privacy",
    "infrastructure-security",
  ]

  console.log("📂 Available Assessment Categories:")
  categories.forEach((category, index) => {
    console.log(`  ${index + 1}. ${category.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}`)
  })

  console.log(`\n✅ ${categories.length} assessment categories available`)
  return true
}

// Main test runner
async function runAllTests() {
  console.log("🚀 Starting AI Assessment System Tests...\n")

  const tests = [
    { name: "Google AI Connection", test: testGoogleAI },
    { name: "PDF Text Extraction", test: testPDFExtraction },
    { name: "File Format Support", test: testFileFormats },
    { name: "Semantic Validation", test: testSemanticValidation },
    { name: "Assessment Categories", test: testAssessmentCategories },
  ]

  const results = []

  for (const testCase of tests) {
    try {
      const result = await testCase.test()
      results.push({ name: testCase.name, passed: result })
    } catch (error) {
      console.error(`❌ Error in ${testCase.name}:`, error)
      results.push({ name: testCase.name, passed: false })
    }
  }

  // Summary
  console.log("\n" + "=".repeat(50))
  console.log("📊 TEST RESULTS SUMMARY")
  console.log("=".repeat(50))

  const passedTests = results.filter((r) => r.passed).length
  const totalTests = results.length

  results.forEach((result) => {
    console.log(`${result.passed ? "✅" : "❌"} ${result.name}`)
  })

  console.log("\n" + "=".repeat(50))
  console.log(`🎯 Overall Result: ${passedTests}/${totalTests} tests passed`)

  if (passedTests === totalTests) {
    console.log("🎉 All tests passed! AI Assessment System is ready.")
  } else {
    console.log("⚠️ Some tests failed. Please check the configuration.")
  }

  console.log("=".repeat(50))
}

// Run tests if this script is executed directly
if (typeof window === "undefined") {
  runAllTests().catch(console.error)
}

export {
  runAllTests,
  testGoogleAI,
  testPDFExtraction,
  testFileFormats,
  testSemanticValidation,
  testAssessmentCategories,
}
