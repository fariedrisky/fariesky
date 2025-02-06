export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t bg-white p-4 text-center text-xs text-gray-600 sm:text-sm">
      © Copyright {currentYear} <strong>fariesky</strong>. All Rights Reserved
    </footer>
  );
}
