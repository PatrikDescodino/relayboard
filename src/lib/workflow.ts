import { createClient } from './supabase';

// Types for workflow execution
export interface WorkflowStep {
  id: string;
  type: 'gmail' | 'sheets' | 'webhook' | 'approval' | 'delay';
  name: string;
  config: any;
  condition?: string;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  steps: WorkflowStep[];
}

export interface ExecutionContext {
  runId: string;
  workflowId: string;
  inputs: any;
  variables: Record<string, any>;
  stepResults: Record<string, any>;
}

/**
 * Basic workflow executor with sequential step execution
 * This is a stub implementation for demonstration purposes
 */
export async function executeWorkflow(
  runId: string,
  workflowId: string,
  inputs: any = {}
): Promise<void> {
  const supabase = createClient();

  try {
    console.log('Starting workflow execution:', {
      runId,
      workflowId,
      inputs
    });

    // Fetch workflow definition
    const { data: workflow, error: workflowError } = await supabase
      .from('workflows')
      .select('*')
      .eq('id', workflowId)
      .single();

    if (workflowError || !workflow) {
      throw new Error(`Workflow not found: ${workflowId}`);
    }

    // Initialize execution context
    const context: ExecutionContext = {
      runId,
      workflowId,
      inputs,
      variables: { ...inputs },
      stepResults: {}
    };

    // For now, simulate a basic workflow with stub steps
    const steps: WorkflowStep[] = [
      {
        id: 'step1',
        type: 'gmail',
        name: 'Send Email',
        config: {
          to: 'user@example.com',
          subject: 'Workflow Started',
          body: 'Your workflow has been triggered.'
        }
      },
      {
        id: 'step2',
        type: 'sheets',
        name: 'Update Spreadsheet',
        config: {
          spreadsheetId: 'example-spreadsheet-id',
          range: 'A1:B1',
          values: [['Timestamp', 'Status'], [new Date().toISOString(), 'Started']]
        }
      },
      {
        id: 'step3',
        type: 'webhook',
        name: 'Call External API',
        config: {
          url: 'https://api.example.com/notify',
          method: 'POST',
          body: { message: 'Workflow completed' }
        }
      }
    ];

    // Execute steps sequentially
    for (const step of steps) {
      try {
        console.log(`Executing step: ${step.name} (${step.type})`);
        
        const stepResult = await executeStep(step, context);
        context.stepResults[step.id] = stepResult;
        
        // Log step completion
        console.log(`Step completed: ${step.name}`, stepResult);
        
      } catch (stepError) {
        console.error(`Step failed: ${step.name}`, stepError);
        
        // Update run status to failed
        await supabase
          .from('runs')
          .update({
            status: 'failed',
            error: `Step '${step.name}' failed: ${stepError}`,
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', runId);
        
        throw stepError;
      }
    }

    // Mark workflow as completed
    await supabase
      .from('runs')
      .update({
        status: 'completed',
        outputs: context.stepResults,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', runId);

    console.log('Workflow execution completed:', {
      runId,
      workflowId,
      results: context.stepResults
    });

  } catch (error) {
    console.error('Workflow execution failed:', error);
    
    // Update run status to failed
    await supabase
      .from('runs')
      .update({
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', runId);
    
    throw error;
  }
}

/**
 * Execute a single workflow step
 */
async function executeStep(
  step: WorkflowStep,
  context: ExecutionContext
): Promise<any> {
  switch (step.type) {
    case 'gmail':
      return await executeGmailStep(step, context);
    case 'sheets':
      return await executeSheetsStep(step, context);
    case 'webhook':
      return await executeWebhookStep(step, context);
    case 'approval':
      return await executeApprovalStep(step, context);
    case 'delay':
      return await executeDelayStep(step, context);
    default:
      throw new Error(`Unsupported step type: ${step.type}`);
  }
}

/**
 * Stub implementation for Gmail step
 */
async function executeGmailStep(
  step: WorkflowStep,
  context: ExecutionContext
): Promise<any> {
  console.log('Gmail step stub:', step.config);
  
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    messageId: `msg_${Date.now()}`,
    to: step.config.to,
    subject: step.config.subject,
    sentAt: new Date().toISOString()
  };
}

/**
 * Stub implementation for Google Sheets step
 */
async function executeSheetsStep(
  step: WorkflowStep,
  context: ExecutionContext
): Promise<any> {
  console.log('Sheets step stub:', step.config);
  
  // Simulate sheets API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    success: true,
    spreadsheetId: step.config.spreadsheetId,
    range: step.config.range,
    updatedCells: step.config.values?.length || 0,
    updatedAt: new Date().toISOString()
  };
}

/**
 * Stub implementation for Webhook step
 */
async function executeWebhookStep(
  step: WorkflowStep,
  context: ExecutionContext
): Promise<any> {
  console.log('Webhook step stub:', step.config);
  
  // Simulate HTTP request delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return {
    success: true,
    url: step.config.url,
    method: step.config.method || 'POST',
    status: 200,
    response: { message: 'Webhook delivered successfully' },
    executedAt: new Date().toISOString()
  };
}

/**
 * Stub implementation for Approval step
 */
async function executeApprovalStep(
  step: WorkflowStep,
  context: ExecutionContext
): Promise<any> {
  console.log('Approval step stub:', step.config);
  
  const supabase = createClient();
  
  // Create approval record
  const approvalToken = `approval_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const { data: approval, error } = await supabase
    .from('approvals')
    .insert({
      run_id: context.runId,
      token: approvalToken,
      status: 'pending',
      message: step.config.message || 'Please approve this workflow step',
      created_at: new Date().toISOString()
    })
    .select()
    .single();
    
  if (error) {
    throw new Error(`Failed to create approval: ${error.message}`);
  }
  
  // Pause execution here - in a real implementation, this would wait for approval
  // For stub purposes, we'll just return the approval info
  return {
    success: true,
    approvalId: approval.id,
    token: approvalToken,
    status: 'pending',
    message: 'Approval request created',
    createdAt: new Date().toISOString()
  };
}

/**
 * Stub implementation for Delay step
 */
async function executeDelayStep(
  step: WorkflowStep,
  context: ExecutionContext
): Promise<any> {
  console.log('Delay step stub:', step.config);
  
  const delayMs = step.config.duration || 1000;
  await new Promise(resolve => setTimeout(resolve, delayMs));
  
  return {
    success: true,
    duration: delayMs,
    delayedUntil: new Date(Date.now() + delayMs).toISOString(),
    completedAt: new Date().toISOString()
  };
}
