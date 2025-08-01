import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { name, email, feedbackType, message } = body
    
    if (!name || !email || !feedbackType || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate feedback type
    const validFeedbackTypes = [
      'feature-request',
      'bug-report', 
      'general-feedback',
      'complaint',
      'praise'
    ]
    
    if (!validFeedbackTypes.includes(feedbackType)) {
      return NextResponse.json(
        { error: 'Invalid feedback type' },
        { status: 400 }
      )
    }

    // Generate a proper feedback ID based on timestamp and random component
    const timestamp = Date.now().toString(36).toUpperCase()
    const randomPart = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    const feedbackId = `FB-${timestamp}-${randomPart}`

    // Here you would typically save to your database
    // For now, we'll just log it and return success
    const feedbackData = {
      id: feedbackId,
      name,
      email,
      feedbackType,
      rating: body.rating || 0,
      message,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    }

    console.log('Feedback submitted:', feedbackData)

    // In a real application, you would:
    // 1. Save to database
    // 2. Send notification email
    // 3. Update analytics
    // 4. Trigger any automated responses

    return NextResponse.json({
      success: true,
      message: 'Feedback submitted successfully',
      id: feedbackData.id,
      feedbackId: feedbackData.id
    })

  } catch (error) {
    console.error('Error processing feedback:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // This endpoint could return feedback analytics
    // For now, we'll return mock data
    const mockAnalytics = {
      totalSubmissions: 1247,
      averageRating: 4.3,
      feedbackTypes: {
        'feature-request': 456,
        'bug-report': 234,
        'general-feedback': 345,
        'complaint': 89,
        'praise': 123
      },
      recentSubmissions: [
        {
          id: 'ABC123',
          name: 'John Doe',
          feedbackType: 'feature-request',
          rating: 5,
          submittedAt: new Date().toISOString()
        },
        {
          id: 'DEF456',
          name: 'Jane Smith',
          feedbackType: 'bug-report',
          rating: 3,
          submittedAt: new Date(Date.now() - 86400000).toISOString()
        }
      ]
    }

    return NextResponse.json(mockAnalytics)
  } catch (error) {
    console.error('Error fetching feedback analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 