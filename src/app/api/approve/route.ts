import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, action, userId } = body; // action can be 'approve' or 'reject'

    if (!token || !action) {
      return NextResponse.json(
        { error: 'Token and action are required' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Find the approval record by token
    const { data: approval, error: fetchError } = await supabase
      .from('approvals')
      .select('*')
      .eq('token', token)
      .eq('status', 'pending')
      .single();

    if (fetchError || !approval) {
      return NextResponse.json(
        { error: 'Invalid or expired approval token' },
        { status: 404 }
      );
    }

    // Update the approval status
    const { error: updateError } = await supabase
      .from('approvals')
      .update({
        status: action === 'approve' ? 'approved' : 'rejected',
        approved_by: userId,
        approved_at: new Date().toISOString(),
      })
      .eq('id', approval.id);

    if (updateError) {
      console.error('Error updating approval:', updateError);
      return NextResponse.json(
        { error: 'Failed to update approval' },
        { status: 500 }
      );
    }

    // Log approval action
    console.log('Approval processed:', {
      approvalId: approval.id,
      runId: approval.run_id,
      action,
      userId
    });

    // If approved, continue the workflow run
    if (action === 'approve') {
      // Update the run status to continue
      const { error: runUpdateError } = await supabase
        .from('runs')
        .update({
          status: 'running',
          updated_at: new Date().toISOString(),
        })
        .eq('id', approval.run_id);

      if (runUpdateError) {
        console.error('Error updating run status:', runUpdateError);
      }
    } else {
      // If rejected, mark the run as failed
      const { error: runUpdateError } = await supabase
        .from('runs')
        .update({
          status: 'failed',
          updated_at: new Date().toISOString(),
          error: 'Workflow rejected by approver',
        })
        .eq('id', approval.run_id);

      if (runUpdateError) {
        console.error('Error updating run status:', runUpdateError);
      }
    }

    return NextResponse.json({
      success: true,
      action,
      approvalId: approval.id,
      runId: approval.run_id
    });
  } catch (error) {
    console.error('Error in /api/approve:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Get approval details for the token
    const { data: approval, error: fetchError } = await supabase
      .from('approvals')
      .select('*, runs(workflow_id)')
      .eq('token', token)
      .single();

    if (fetchError || !approval) {
      return NextResponse.json(
        { error: 'Invalid or expired approval token' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      approval: {
        id: approval.id,
        runId: approval.run_id,
        workflowId: approval.runs?.workflow_id,
        status: approval.status,
        message: approval.message,
        createdAt: approval.created_at
      }
    });
  } catch (error) {
    console.error('Error in GET /api/approve:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
