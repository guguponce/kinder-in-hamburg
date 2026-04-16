export const SharingIcons = ({
  icon = "whatsapp",
  className,
}: {
  icon: string;
  className?: string;
}) => {
  const platform: { [key: string]: { alt: string; iconRef: string } } = {
    whatsapp: {
      alt: "Teile auf WhatsApp",
      iconRef: "/assets/icons/share/whatsapp.webp",
    },
    telegram: {
      alt: "Teile auf Telegram",
      iconRef: "/assets/icons/share/telegram.webp",
    },
    mail: { alt: "Teile per E-Mail", iconRef: "/assets/icons/share/mail.webp" },
  };
  return (
    <img
      src={platform[icon]?.iconRef || "/assets/icons/share/whatsapp.webp"}
      alt={platform[icon]?.alt || "Share icon"}
      className={className || "w-full h-full"}
    />
  );
};
