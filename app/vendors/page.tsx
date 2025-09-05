"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/components/auth-context"
import { VendorHero } from "@/components/vendors/VendorHero"
import { VendorStats } from "@/components/vendors/VendorStats"
import { VendorFilters } from "@/components/vendors/VendorFilters"
import { VendorList } from "@/components/vendors/VendorList"
import { AddVendorModal } from "@/components/vendors/AddVendorModal"
import { VendorDetailsModal } from "@/components/vendors/VendorDetailsModal"
import type { Vendor } from "@/components/vendors/VendorList" // Import Vendor type from VendorList
import { generateTicketId } from "@/lib/utils" // Import generateTicketId

export default function VendorsPage() {
  return (
    <AuthGuard>
      <VendorsContent />
    </AuthGuard>
  )
}

function VendorsContent() {
  const { user, profile, organization } = useAuth()
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [riskFilter, setRiskFilter] = useState("all")
  const [showAddVendor, setShowAddVendor] = useState(false)
  const [addVendorForm, setAddVendorForm] = useState<AddVendorForm>({
    name: "",
    email: "",
    industry: "",
    size: "",
    website: "",
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
  });
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const [showVendorDetails, setShowVendorDetails] = useState(false)

  // Mock vendor data
  const mockVendors: Vendor[] = [
    {
      id: "1",
      ticket_id: "VND-10001", // Added ticket_id
      name: "TechCorp Solutions",
      email: "contact@techcorp.com",
      website: "https://techcorp.com",
      industry: "Technology",
      size: "201-500 employees",
      contact_person: "John Smith",
      contact_email: "john.smith@techcorp.com",
      contact_phone: "+1 (555) 123-4567",
      risk_level: "low",
      status: "active",
      tags: ["cloud-provider", "critical"],
      last_assessment_date: "2024-01-15",
      next_assessment_date: "2024-07-15",
      total_assessments: 3,
      completed_assessments: 3,
      average_risk_score: 85,
      created_at: "2023-06-01",
    },
    {
      id: "2",
      ticket_id: "VND-10002", // Added ticket_id
      name: "DataFlow Analytics",
      email: "info@dataflow.com",
      website: "https://dataflow.com",
      industry: "Data Analytics",
      size: "51-200 employees",
      contact_person: "Sarah Johnson",
      contact_email: "sarah.johnson@dataflow.com",
      contact_phone: "+1 (555) 234-5678",
      risk_level: "medium",
      status: "active",
      tags: ["data-processing", "gdpr"],
      last_assessment_date: "2024-01-20",
      next_assessment_date: "2024-08-20",
      total_assessments: 2,
      completed_assessments: 1,
      average_risk_score: 72,
      created_at: "2023-08-15",
    },
    {
      id: "3",
      ticket_id: "VND-10003", // Added ticket_id
      name: "SecureNet Services",
      email: "contact@securenet.com",
      website: "https://securenet.com",
      industry: "Cybersecurity",
      size: "11-50 employees",
      contact_person: "Michael Chen",
      contact_email: "michael.chen@securenet.com",
      risk_level: "high",
      status: "under_review",
      tags: ["security", "penetration-testing"],
      last_assessment_date: "2023-12-10",
      next_assessment_date: "2024-06-10",
      total_assessments: 1,
      completed_assessments: 1,
      average_risk_score: 58,
      created_at: "2023-11-01",
    },
    {
      id: "4",
      ticket_id: "VND-10004", // Added ticket_id
      name: "CloudHost Pro",
      email: "support@cloudhost.com",
      website: "https://cloudhost.com",
      industry: "Cloud Infrastructure",
      size: "500+ employees",
      contact_person: "Lisa Davis",
      contact_email: "lisa.davis@cloudhost.com",
      contact_phone: "+1 (555) 345-6789",
      risk_level: "low",
      status: "active",
      tags: ["infrastructure", "iso27001"],
      last_assessment_date: "2024-01-25",
      next_assessment_date: "2024-07-25",
      total_assessments: 4,
      completed_assessments: 4,
      average_risk_score: 92,
      created_at: "2023-03-20",
    },
  ]

  useEffect(() => {
    // Simulate loading vendors
    setTimeout(() => {
      setVendors(mockVendors)
      setLoading(false)
    }, 1000)
  }, [])

  const getVendorStats = () => {
    const total = vendors.length
    const active = vendors.filter((v) => v.status === "active").length
    const highRisk = vendors.filter((v) => v.risk_level === "high" || v.risk_level === "critical").length
    const avgRiskScore =
      vendors.length > 0 ? Math.round(vendors.reduce((sum, v) => sum + v.average_risk_score, 0) / vendors.length) : 0

    return { total, active, highRisk, avgRiskScore }
  }

  const stats = getVendorStats()

  const handleAddVendorFormChange = (field: keyof AddVendorForm, value: string) => {
    setAddVendorForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddVendorSubmit = (form: AddVendorForm) => {
    // Simulate adding a new vendor
    const newVendor: Vendor = {
      id: String(vendors.length + 1),
      ticket_id: generateTicketId("VND"), // Generate ticket_id
      name: form.name,
      email: form.email,
      website: form.website,
      industry: form.industry,
      size: form.size,
      contact_person: form.contactPerson,
      contact_email: form.contactEmail,
      contact_phone: form.contactPhone,
      risk_level: "pending", // New vendors start as pending
      status: "active",
      tags: [],
      total_assessments: 0,
      completed_assessments: 0,
      average_risk_score: 0,
      created_at: new Date().toISOString(),
    };
    setVendors((prev) => [...prev, newVendor]);
    setShowAddVendor(false);
    setAddVendorForm({ // Reset form
      name: "", email: "", industry: "", size: "", website: "",
      contactPerson: "", contactEmail: "", contactPhone: ""
    });
    alert(`Vendor ${newVendor.name} added successfully!`);
  };

  const handleVendorClick = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setShowVendorDetails(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <VendorHero onAddVendorClick={() => setShowAddVendor(true)} />
        <VendorStats {...stats} />
        <VendorFilters
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          riskFilter={riskFilter}
          onRiskFilterChange={setRiskFilter}
          onExportClick={() => alert("Export functionality coming soon!")}
        />
        <VendorList
          vendors={vendors}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          riskFilter={riskFilter}
          onVendorClick={handleVendorClick}
          onAddFirstVendorClick={() => setShowAddVendor(true)}
        />
      </div>

      <AddVendorModal
        isOpen={showAddVendor}
        onClose={() => setShowAddVendor(false)}
        onSubmit={handleAddVendorSubmit}
        form={addVendorForm}
        onFormChange={handleAddVendorFormChange}
      />

      <VendorDetailsModal
        isOpen={showVendorDetails}
        onClose={() => setShowVendorDetails(false)}
        vendor={selectedVendor}
      />
    </div>
  )
}
