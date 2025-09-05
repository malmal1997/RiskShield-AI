interface AssessmentEmailParams {
  vendorName: string
  vendorEmail: string
  contactPerson: string
  assessmentType: string
  dueDate: string
  customMessage: string
  assessmentId: string
  companyName: string
}

export async function sendAssessmentEmail(params: AssessmentEmailParams) {
  try {
    // In a real implementation, this would send an actual email
    // For now, we'll simulate the email sending process

    console.log("Sending assessment email:", params)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Store the assessment info for demo purposes
    const assessmentInfo = {
      assessmentId: params.assessmentId,
      vendorName: params.vendorName,
      vendorEmail: params.vendorEmail,
      contactPerson: params.contactPerson,
      assessmentType: params.assessmentType,
      dueDate: params.dueDate,
      customMessage: params.customMessage,
      companyName: params.companyName,
      status: "sent",
      sentDate: new Date().toISOString(),
    }

    // Store in localStorage for demo purposes
    const existingAssessments = JSON.parse(localStorage.getItem("sentAssessments") || "[]")
    existingAssessments.push(assessmentInfo)
    localStorage.setItem("sentAssessments", JSON.stringify(existingAssessments))

    return {
      success: true,
      message: "Assessment email sent successfully",
      assessmentId: params.assessmentId,
    }
  } catch (error) {
    console.error("Error sending assessment email:", error)
    return {
      success: false,
      message: "Failed to send assessment email",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function sendAssessmentReminder(assessmentId: string) {
  try {
    console.log("Sending assessment reminder for:", assessmentId)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      success: true,
      message: "Reminder sent successfully",
    }
  } catch (error) {
    console.error("Error sending reminder:", error)
    return {
      success: false,
      message: "Failed to send reminder",
    }
  }
}
