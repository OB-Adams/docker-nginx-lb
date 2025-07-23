import { faHome, faTicket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

const APP_NAME=process.env.NEXT_PUBLIC_APP_NAME
const Nav = () => {
  return (
    <nav className="flex justify-between p-4 bg-gray-900">
      <div className="flex gap-2.5">
        <Link href="/">
          <FontAwesomeIcon icon={faHome} className="icon" />
        </Link>
        <Link href="/TicketPage/new">
          <FontAwesomeIcon icon={faTicket} className="icon" />
        </Link>
      </div>
      <div>
        <p className="text-white">obobadams@gmail.com</p>
 	<p className="text-white">{`${APP_NAME}`}</p>
      </div>
    </nav>
  );
};

export default Nav;
