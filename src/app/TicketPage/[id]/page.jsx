import TicketForm from "@/app/(components)/TicketForm";

const getTicketById = async (id) => {
  try {
    const baseUrl = process.env.API_BASE_URL || "http://localhost:3000"; 
    const url = `${baseUrl}/api/Tickets/${id}`;
    console.log("Fetching ticket from URL:", url);
    const res = await fetch(url, {
      cache: "no-store",
    });
    console.log("Response status:", res.status);
    const data = await res.json();
    console.log("Response data:", data);
    if (!res.ok) {
      console.error("Fetch error:", data.message || "Failed to fetch ticket");
      return null;
    }
    return data;
  } catch (error) {
    console.error("Error fetching ticket:", error);
    return null;
  }
};

const TicketPage = async ({ params }) => {
  const EDITMODE = params.id === "new" ? false : true;
  let updateTicketData = {};

  if (EDITMODE) {
    const ticketData = await getTicketById(params.id);
    if (!ticketData) {
      updateTicketData = { _id: "not-found" };
    } else {
      updateTicketData = ticketData;
    }
    console.log("Fetched ticket:", updateTicketData);
  } else {
    updateTicketData = {
      _id: "new",
    };
  }

  return <TicketForm ticket={updateTicketData} />;
};

export default TicketPage;