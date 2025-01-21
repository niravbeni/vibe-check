import { LabelEvaluationProps } from './LabelEvaluation.types'
import {
  Container,
  PromptInfo,
  LabelsContainer,
  Label,
  ButtonContainer,
  EvalButton,
  Progress
} from './LabelEvaluation.styles'

export const LabelEvaluation = ({
  promptResult,
  currentIndex,
  totalPrompts,
  onEvaluate
}: LabelEvaluationProps) => {
  return (
    <Container>
      <h2>Evaluate Labels</h2>
      <PromptInfo>
        <h3>Prompt:</h3>
        <p>{promptResult.promptText}</p>
      </PromptInfo>

      <LabelsContainer>
        {promptResult.labels.map((label, idx) => (
          <Label key={idx}>{label}</Label>
        ))}
      </LabelsContainer>

      <ButtonContainer>
        <EvalButton onClick={() => onEvaluate('bad')} $variant="not-effective">
          Not Effective
        </EvalButton>
        <EvalButton onClick={() => onEvaluate('ok')} $variant="somewhat-effective">
          Somewhat Effective
        </EvalButton>
        <EvalButton onClick={() => onEvaluate('good')} $variant="very-effective">
          Very Effective
        </EvalButton>
      </ButtonContainer>

      <Progress>
        {currentIndex + 1} of {totalPrompts} prompts
      </Progress>
    </Container>
  )
} 