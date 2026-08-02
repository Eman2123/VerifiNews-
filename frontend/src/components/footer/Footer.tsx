const Footer = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center px-1 pb-8 pt-3 lg:px-8">
      <p className="text-center text-xs text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} VerifiNews — Admin Panel
      </p>
    </div>
  );
};

export default Footer;
