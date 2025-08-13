import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { executeWorkflow } from '@/lib/workflow';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Webhook ID is required' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Log the webhook payload for debugging
    console.log('Webhook received:', {
      webhookId: id,
      payload: body,
      timestamp: new Date().toISOString()
    });

    // Find the workflow associated with this webhook ID
    const { data: workflow, error: workflowError } = await supabase
      .from('workflows')
      .select('*')
      .eq('webhook_id', id)
      .eq('status', 'active')
      .single();

    if (workflowError || !workflow) {
      console.log('No active workflow found for webhook ID:', id);
      return NextResponse.json(
        { error: 'No active workflow found for this webhook' },
        { status: 404 }
      );
    }

    // Create a new run record for the webhook trigger
    const { data: run, error: runError } = await supabase
      .from('runs')
      .insert({
        workflow_id: workflow.id,
        user_id: workflow.user_id,
        status: 'running',
        trigger_type: 'webhook',
        inputs: {
          webhookPayload: body,
          webhookId: id,
          timestamp: new Date().toISOString()
        },
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (runError) {
      console.error('Error creating webhook run:', runError);
      return NextResponse.json(
        { error: 'Failed to create workflow run' },
        { status: 500 }
      );
    }

    // Log the successful webhook processing
    console.log('Webhook processed successfully:', {
      webhookId: id,
      workflowId: workflow.id,
      runId: run.id,
      workflowName: workflow.name
    });

    // Enqueue workflow execution asynchronously
    executeWorkflow(run.id, workflow.id, {
      webhookPayload: body,
      webhookId: id
    }).catch((error) => {
      console.error('Webhook workflow execution error:', error);
    });

    return NextResponse.json({
      success: true,
      webhookId: id,
      workflowId: workflow.id,
      runId: run.id,
      message: `Webhook processed and workflow '${workflow.name}' started`
    });
  } catch (error) {
    console.error('Error in webhook API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET method for webhook testing/verification
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Webhook ID is required' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Check if webhook ID exists and is active
    const { data: workflow, error: workflowError } = await supabase
      .from('workflows')
      .select('id, name, status, created_at')
      .eq('webhook_id', id)
      .single();

    if (workflowError || !workflow) {
      return NextResponse.json(
        { error: 'Webhook not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      webhookId: id,
      workflow: {
        id: workflow.id,
        name: workflow.name,
        status: workflow.status,
        createdAt: workflow.created_at
      },
      message: 'Webhook is active and ready to receive payloads'
    });
  } catch (error) {
    console.error('Error in webhook GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
