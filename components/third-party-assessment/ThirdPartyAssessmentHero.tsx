"use client";

import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface ThirdPartyAssessmentHeroProps {
  onSendInvitationClick: () => void;
}

export function ThirdPartyAssessmentHero({ onSendInvitationClick }: ThirdPartyAssessmentHeroProps) {
  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">Vendor Risk Management</Badge>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Third-Party Assessment
            <br />
            <span className="text-blue-600">Vendor Risk Evaluation</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Send secure assessment invitations to your vendors and third-party partners. Evaluate their risk posture
            and compliance status through comprehensive questionnaires.
          </p>
          <div className="mt-8">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={onSendInvitationClick}
            >
              <Send className="mr-2 h-4 w-4" />
              Send Assessment Invitation
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}