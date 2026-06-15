export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Campus to Corporate (c2c). All rights reserved.
        </p>
      </div>
    </footer>
  );
}
