import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { executeWorkflow } from '@/lib/workflow';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workflowId, userId, inputs } = body;

    if (!workflowId) {
      return NextResponse.json(
        { error: 'workflowId is required' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Create a new run record
    const { data: run, error: runError } = await supabase
      .from('runs')
      .insert({
        workflow_id: workflowId,
        user_id: userId,
        status: 'running',
        inputs: inputs || {},
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (runError) {
      console.error('Error creating run:', runError);
      return NextResponse.json(
        { error: 'Failed to create run' },
        { status: 500 }
      );
    }

    // Log the run start to Supabase
    console.log('Workflow run started:', {
      runId: run.id,
      workflowId,
      userId,
      inputs
    });

    // Start workflow execution asynchronously
    executeWorkflow(run.id, workflowId, inputs).catch((error) => {
      console.error('Workflow execution error:', error);
    });

    return NextResponse.json({
      success: true,
      runId: run.id,
      status: 'running'
    });
  } catch (error) {
    console.error('Error in /api/run:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
