import { NextResponse } from 'next/server'

import Payment from '@/src/models/Payment'
import Users from '@/src/models/Users' // Correct import path
import Menu from '@/src/models/Menu'
import connectDB from '../../lib/connectDB'

export async function GET() {
    try {
        await connectDB()

        const [totalRevenue, totalUsers, totalMenuItems] = await Promise.all([
            Payment.aggregate([
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ]),
            Users.countDocuments(),
            Menu.countDocuments()
        ])

        const totalOrders = await Payment.countDocuments()

        return NextResponse.json({
            totalRevenue: totalRevenue[0]?.total || 0,
            totalUsers,
            totalOrders,
            totalMenuItems
        })
    } catch (error) {
        console.error('Stats error:', error)
        return NextResponse.json(
            { 
                error: 'Failed to fetch stats',
                details: error.message,
                ...(process.env.NODE_ENV === 'development' && {
                    stack: error.stack
                })
            },
            { status: 500 }
        )
    }
}