export const WhatsAppButton = () => {
  const whatsappNumber =
    import.meta.env.VITE_WHATSAPP_NUMBER || "5511941930678";
  const message = encodeURIComponent(
    "Olá! Gostaria de conhecer mais sobre seus serviços."
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conversar no WhatsApp"
      className="fixed bottom-6 right-6 z-50 group"
    >
      {/* Botão oficial do WhatsApp */}
      <div className="relative">
        {/* Pulse animation background */}
        <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-75"></div>

        {/* Main button */}
        <div className="relative bg-[#25D366] hover:bg-[#20BA5A] transition-all duration-300 rounded-full shadow-lg hover:shadow-2xl p-4 hover:scale-110">
          {/* WhatsApp Official Icon SVG */}
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M27.281 4.65C24.318 1.686 20.36 0.043 16.125 0C7.334 0 0.178 7.156 0.175 15.948C0.174 18.768 0.915 21.52 2.328 23.936L0.039 32L8.331 29.751C10.652 31.043 13.264 31.723 15.919 31.724H15.925C24.715 31.724 31.871 24.568 31.874 15.776C31.876 11.543 30.244 7.614 27.281 4.65ZM16.125 29.063H16.12C13.732 29.063 11.388 28.421 9.354 27.213L8.876 26.933L3.848 28.233L5.173 23.337L4.863 22.841C3.534 20.733 2.835 18.375 2.836 15.948C2.838 8.623 8.801 2.661 16.131 2.661C19.709 2.662 23.065 4.004 25.606 6.547C28.148 9.09 29.487 12.447 29.486 16.025C29.484 23.35 23.521 29.313 16.125 29.063Z"
              fill="white"
            />
            <path
              d="M12.027 9.616C11.74 8.982 11.437 8.969 11.164 8.958C10.941 8.949 10.688 8.949 10.435 8.949C10.182 8.949 9.769 9.041 9.415 9.455C9.061 9.869 7.984 10.884 7.984 12.943C7.984 15.002 9.445 17.001 9.658 17.254C9.871 17.507 12.712 22.071 17.173 23.862C20.783 25.341 21.634 25.001 22.541 24.913C23.448 24.825 25.157 23.891 25.511 22.928C25.865 21.965 25.865 21.15 25.776 21.002C25.687 20.854 25.434 20.765 25.05 20.587C24.666 20.409 22.607 19.394 22.253 19.276C21.899 19.158 21.646 19.099 21.393 19.483C21.14 19.867 20.344 20.765 20.121 21.018C19.898 21.271 19.675 21.301 19.291 21.123C18.907 20.945 17.605 20.507 16.059 19.128C14.854 18.055 14.03 16.724 13.807 16.34C13.584 15.956 13.782 15.748 13.96 15.57C14.119 15.411 14.314 15.167 14.492 14.944C14.67 14.721 14.729 14.557 14.847 14.304C14.965 14.051 14.906 13.828 14.817 13.65C14.729 13.472 13.918 11.407 13.594 10.639C13.278 9.897 12.957 9.997 12.727 9.985C12.504 9.974 12.251 9.973 11.998 9.973L12.027 9.616Z"
              fill="white"
            />
          </svg>
        </div>

        {/* Tooltip */}
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg whitespace-nowrap font-medium">
            Oi! 👋 Falar com Janice Correia?
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full">
              <div className="border-8 border-transparent border-l-white"></div>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};
