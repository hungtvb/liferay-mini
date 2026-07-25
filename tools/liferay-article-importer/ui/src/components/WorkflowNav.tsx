import {Check, Database, FileCheck2, FileSpreadsheet, Globe, Settings2} from 'lucide-react';
import type {Step} from '../types';

const steps = [
  {id: 1 as Step, label: 'Connect', Icon: Globe},
  {id: 2 as Step, label: 'Configure', Icon: Settings2},
  {id: 3 as Step, label: 'Workbook', Icon: FileSpreadsheet},
  {id: 4 as Step, label: 'Validate', Icon: FileCheck2},
  {id: 5 as Step, label: 'Import', Icon: Database}
];

interface WorkflowNavProps {
  currentStep: Step;
  maxUnlockedStep: Step;
  onStepChange: (step: Step) => void;
}

function stepState(step: Step, currentStep: Step, maxUnlockedStep: Step) {
  if (step === currentStep) return 'current';
  if (step < currentStep && step <= maxUnlockedStep) return 'complete';
  if (step <= maxUnlockedStep) return 'ready';
  return 'locked';
}

export function WorkflowNav({currentStep, maxUnlockedStep, onStepChange}: WorkflowNavProps) {
  return (
    <nav className="workflow" aria-label="Workflow progress">
      <div className="workflow-desktop">
        <span className="workflow-line" aria-hidden="true" />
        <ol>
          {steps.map(({id, label}) => {
            const state = stepState(id, currentStep, maxUnlockedStep);

            return (
              <li key={id}>
                <button
                  type="button"
                  className={`workflow-step is-${state}`}
                  disabled={id > maxUnlockedStep}
                  aria-current={id === currentStep ? 'step' : undefined}
                  onClick={() => onStepChange(id)}
                >
                  <span className="workflow-circle">{state === 'complete' ? <Check size={14} strokeWidth={3} /> : id}</span>
                  <span>
                    <strong>{label}</strong>
                    <small>{state === 'complete' ? 'Complete' : state === 'current' ? 'Current step' : state === 'ready' ? 'Ready' : 'Not started'}</small>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="workflow-mobile" aria-label={`Step ${currentStep} of 5`}>
        <div className="mobile-stepper">
          {steps.map(({id, label, Icon}, index) => {
            const state = stepState(id, currentStep, maxUnlockedStep);

            return (
              <div className="mobile-step-group" key={id}>
                <button
                  type="button"
                  className={`mobile-step is-${state}`}
                  disabled={id > maxUnlockedStep}
                  aria-current={id === currentStep ? 'step' : undefined}
                  onClick={() => onStepChange(id)}
                >
                  <span className="mobile-step-circle">
                    {state === 'complete' ? <Check size={16} strokeWidth={3} /> : <Icon size={18} />}
                  </span>
                  <span>{label}</span>
                </button>
                {index < steps.length - 1 && <span className={`mobile-step-line ${id < currentStep ? 'is-complete' : ''}`} aria-hidden="true" />}
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
