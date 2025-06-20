import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { MenuIcon, XIcon, SearchIcon, TicketPlus } from "lucide-react";
import { useState } from "react";
import { useClerk, useUser, UserButton } from "@clerk/clerk-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();

  return (
    <div className="fixed top-4 left-0 w-full z-50 flex px-10 justify-between items-center ">
      <Link to="/" className="flex items-center h-full">
        <img
          src="qwe.png"
          alt="logo"
          className="h-[75px] w-auto object-contain"
        />
      </Link>

      <div
        className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium
max-md:text-lg z-50 flex flex-col md:flex-row items-center
max-md:justify-center gap-8 min-md:px-8 py-3 max-md:h-screen
min-md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border
border-gray-300/20 overflow-hidden transition-[width] duration-300
${isOpen ? "max-md:w-full" : "max-md:w-0"}`}
      >
        <XIcon
          className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />
        <Link
          onClick={() => {
            scrollTo(0, 0); setIsOpen(false);
          }}
          to="/"
        >
          Home
        </Link>
        <Link
          onClick={() => {
            scrollTo(0, 0); setIsOpen(false);
          }}
          to="/movies"
        >
          Movies
        </Link>
        <Link
          onClick={() => {
            scrollTo(0, 0); setIsOpen(false);
          }}
          to="/"
        >
          Theaters
        </Link>
        <Link
          onClick={() => {
            scrollTo(0, 0); setIsOpen(false);
          }}
          to="/"
        >
          Releases
        </Link>
        <Link
          onClick={() => {
            scrollTo(0, 0); setIsOpen(false);
          }}
          to="/favorites"
        >
          Favorites
        </Link>
      </div>

      <div className="flex items-center gap-8">
        <SearchIcon className="max-md:hidden w-6 h-6 cursor-pointer" />

        {!user ? (
          <button
            onClick={openSignIn}
            className="px-4 py-l sm:px-7 sm:py-2
bg-primary hover:bg-primary-dull transition rounded-full
font-medium cursor-pointer"
          >
            Login
          </button>
        ) : (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label="Bookings"
                labelIcon={<TicketPlus width={15} />}
                onClick={() => navigate("/my-bookings")}
              />
            </UserButton.MenuItems>
          </UserButton>
        )}
      </div>
      <MenuIcon
        className="max-md:m-4 md:hidden w-8 h-8 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      />
    </div>
  );
};

export default Navbar;

// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { MenuIcon, XIcon, SearchIcon, TicketPlus } from "lucide-react";
// import { useState } from "react";
// import { useClerk, useUser, UserButton } from "@clerk/clerk-react";

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const { user } = useUser();
//   const { openSignIn } = useClerk();
//   const navigate = useNavigate();

//   return (
//     <div className="fixed top-0 left-0 w-full z-50 flex px-10 justify-between items-center h-24">
//       {/* Logo section with fixed height and perfect alignment */}
//       <Link to="/" className="flex items-center h-full">
//         <img
//           src="qwe.png"
//           alt="logo"
//           className="h-[75px] w-auto object-contain"
//         />
//       </Link>

//       {/* Middle navigation - unchanged but perfectly aligned */}
//       <div
//         className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium
//           max-md:text-lg z-50 flex flex-col md:flex-row items-center
//           max-md:justify-center gap-8 min-md:px-8 py-3 max-md:h-screen
//           min-md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border
//           border-gray-300/20 overflow-hidden transition-[width] duration-300
//           ${isOpen ? "max-md:w-full" : "max-md:w-0"}`}
//       >
//         <XIcon
//           className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer"
//           onClick={() => setIsOpen(!isOpen)}
//         />
//         <Link
//           onClick={() => {
//             scrollTo(0, 0); setIsOpen(false);
//           }}
//           to="/"
//         >
//           Home
//         </Link>
//         <Link
//           onClick={() => {
//             scrollTo(0, 0); setIsOpen(false);
//           }}
//           to="/movies"
//         >
//           Movies
//         </Link>
//         <Link
//           onClick={() => {
//             scrollTo(0, 0); setIsOpen(false);
//           }}
//           to="/"
//         >
//           Theaters
//         </Link>
//         <Link
//           onClick={() => {
//             scrollTo(0, 0); setIsOpen(false);
//           }}
//           to="/"
//         >
//           Releases
//         </Link>
//         <Link
//           onClick={() => {
//             scrollTo(0, 0); setIsOpen(false);
//           }}
//           to="/favorites"
//         >
//           Favorites
//         </Link>
//       </div>

//       {/* Right section - unchanged but perfectly aligned */}
//       <div className="flex items-center gap-8">
//         <SearchIcon className="max-md:hidden w-6 h-6 cursor-pointer" />

//         {!user ? (
//           <button
//             onClick={openSignIn}
//             className="px-4 py-l sm:px-7 sm:py-2
//             bg-primary hover:bg-primary-dull transition rounded-full
//             font-medium cursor-pointer"
//           >
//             Login
//           </button>
//         ) : (
//           <UserButton>
//             <UserButton.MenuItems>
//               <UserButton.Action
//                 label="Bookings"
//                 labelIcon={<TicketPlus width={15} />}
//                 onClick={() => navigate("/my-bookings")}
//               />
//             </UserButton.MenuItems>
//           </UserButton>
//         )}
//       </div>
//       <MenuIcon
//         className="max-md:m-4 md:hidden w-8 h-8 cursor-pointer"
//         onClick={() => setIsOpen(!isOpen)}
//       />
//     </div>
//   );
// };

// export default Navbar;
