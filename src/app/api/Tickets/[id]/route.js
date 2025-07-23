import Ticket from "@/app/(models)/Ticket";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const foundTicket = await Ticket.findOne({ _id: params.id });
    if (!foundTicket) {
      return NextResponse.json(
        { message: "Ticket not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(foundTicket, { status: 200 });
  } catch (error) {
    console.error("Error fetching ticket:", error);
    return NextResponse.json(
      { message: "Failed to fetch ticket" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;
  try {
    const ticket = await Ticket.findByIdAndDelete(id);
    if (!ticket) {
      return NextResponse.json(
        { message: "Ticket not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Ticket deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting ticket:", error);
    return NextResponse.json(
      { message: "Failed to delete ticket" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    const ticketData = body; 
    const updateTicketData = await Ticket.findByIdAndUpdate(id, ticketData, {
      new: true, 
      runValidators: true,
    });
    if (!updateTicketData) {
      return NextResponse.json(
        { message: "Ticket not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        message: "Ticket updated successfully",
        ticket: updateTicketData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating ticket:", error);
    return NextResponse.json(
      { message: "Failed to update ticket" },
      { status: 500 }
    );
  }
}