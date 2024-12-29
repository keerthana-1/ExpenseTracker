
function Header({isOpen,setIsOpen}) {

    return (
        <div>
            {/* Fixed Header */}
            <header className="fixed top-0 left-0 w-full bg-blue-950 text-white p-5 flex items-center justify-between lg:justify-center z-50">
                <h1 className="text-3xl font-bold">Expense Tracker</h1>
                
                {/* Hamburger Menu Button for Small Screens */}
                <button
                    className="text-white focus:outline-none lg:hidden"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16m-7 6h7"
                        ></path>
                    </svg>
                </button>
            </header>

            {/* Overlay for Small Screens */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-blue-950 bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

        </div>
    );
}

export default Header;
