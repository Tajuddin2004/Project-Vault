import React, { useState } from 'react';

export function ReviewRubric({ onSaveRubric }) {
  const [rubric, setRubric] = useState({
    codeArchitecture: 25, // max 25
    testCompleteness: 25, // max 25
    documentationQuality: 25, // max 25
    vulnerabilityHardening: 25, // max 25
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const totalScore =
    Number(rubric.codeArchitecture) +
    Number(rubric.testCompleteness) +
    Number(rubric.documentationQuality) +
    Number(rubric.vulnerabilityHardening);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (onSaveRubric) {
      onSaveRubric({ ...rubric, totalScore, timestamp: new Date().toISOString() });
    }
  };

  return (
    <div className="pv-rubric-card">
      <div className="pv-rubric-header">
        <div>
          <div className="pv-eyebrow">FACULTY EVALUATION TOOLKIT</div>
          <h3>Structured Review Rubric</h3>
        </div>
        <div className="pv-rubric-total">
          <span>TOTAL GRADE:</span>
          <strong>{totalScore} / 100</strong>
        </div>
      </div>

      {submitted ? (
        <div className="pv-alert-msg pv-alert-msg--success" style={{ margin: '16px 0 0' }}>
          ✓ Faculty Evaluation & Rubric Grade ({totalScore}/100) recorded in verification ledger.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="pv-rubric-form">
          <div className="pv-rubric-grid">
            <div className="pv-rubric-field">
              <div className="pv-rubric-field-head">
                <label>Code Architecture & Design Patterns</label>
                <span>{rubric.codeArchitecture} / 25 pts</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                value={rubric.codeArchitecture}
                onChange={(e) => setRubric({ ...rubric, codeArchitecture: Number(e.target.value) })}
                className="pv-range-input"
              />
            </div>

            <div className="pv-rubric-field">
              <div className="pv-rubric-field-head">
                <label>Test Suite & Edge Case Coverage</label>
                <span>{rubric.testCompleteness} / 25 pts</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                value={rubric.testCompleteness}
                onChange={(e) => setRubric({ ...rubric, testCompleteness: Number(e.target.value) })}
                className="pv-range-input"
              />
            </div>

            <div className="pv-rubric-field">
              <div className="pv-rubric-field-head">
                <label>Documentation & API Schema Clarity</label>
                <span>{rubric.documentationQuality} / 25 pts</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                value={rubric.documentationQuality}
                onChange={(e) => setRubric({ ...rubric, documentationQuality: Number(e.target.value) })}
                className="pv-range-input"
              />
            </div>

            <div className="pv-rubric-field">
              <div className="pv-rubric-field-head">
                <label>Security & Vulnerability Hardening</label>
                <span>{rubric.vulnerabilityHardening} / 25 pts</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                value={rubric.vulnerabilityHardening}
                onChange={(e) => setRubric({ ...rubric, vulnerabilityHardening: Number(e.target.value) })}
                className="pv-range-input"
              />
            </div>
          </div>

          <div className="pv-rubric-field" style={{ marginTop: 16 }}>
            <label>Instructor Audit Feedback & Remarks</label>
            <textarea
              rows={3}
              placeholder="Provide technical feedback for the student..."
              value={rubric.notes}
              onChange={(e) => setRubric({ ...rubric, notes: e.target.value })}
              className="pv-input"
            />
          </div>

          <button type="submit" className="pv-btn-primary" style={{ marginTop: 16 }}>
            Submit Faculty Endorsement & Grade
          </button>
        </form>
      )}
    </div>
  );
}
