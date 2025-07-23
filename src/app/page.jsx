import TicketCard from "./(components)/TicketCard";

const getTickets = async () => {
  try {
    const baseUrl = process.env.API_BASE_URL || "http://localhost:3000"; // Fallback for local dev
    const url = `${baseUrl}/api/Tickets`;
    console.log("Fetching tickets from URL:", url);
    const res = await fetch(url, {
      cache: "no-store",
    });
    console.log("Response status:", res.status);
    if (!res.ok) {
      throw new Error("Failed to fetch tickets");
    }
    const data = await res.json();
    console.log("Response data:", data);
    return data; // Expecting { tickets: [...] }
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return { tickets: [] };
  }
};

const Dashboard = async () => {
  const { tickets } = await getTickets();

  const uniqueCategories = [
    ...new Set(tickets?.map((ticket) => ticket.category)),
  ];

  return (
    <div className="p-5">
      <div>
        {tickets?.length > 0 ? (
          uniqueCategories?.map((uniqueCategory, categoryIndex) => (
            <div className="mb-4" key={categoryIndex}>
              <h2>
                {uniqueCategory.charAt(0).toUpperCase() +
                  uniqueCategory.slice(1)}
              </h2>
              <div className="lg:grid grid-cols-2 xl:grid-cols-4">
                {tickets
                  .filter((ticket) => ticket.category === uniqueCategory)
                  .map((filteredTicket) => (
                    <TicketCard
                      id={filteredTicket._id}
                      key={filteredTicket._id}
                      ticket={filteredTicket}
                    />
                  ))}
              </div>
            </div>
          ))
        ) : (
          <p>No tickets available.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;