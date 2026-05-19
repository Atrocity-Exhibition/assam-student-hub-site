export function Footer() {
  return (
    <footer className="border-t border-zinc-900 py-12">
      <div className="flex flex-col gap-10 md:flex-row md:justify-between">
        {/* BRAND */}
        <div className="max-w-sm">
          <h3 className="text-xl font-black">
            <span className="text-green-500">
              Assam
            </span>

            <span className="text-white">
              Student
            </span>

            <span className="text-red-500">
              Hub
            </span>
          </h3>

          <p className="mt-4 text-sm leading-6 text-zinc-400">
            Aggregating Assam jobs,
            scholarships, university
            notices, admissions, and exam
            updates in one place.
          </p>
        </div>

        {/* LINKS */}
        <div className="grid grid-cols-2 gap-10 text-sm sm:grid-cols-3">
          <div>
            <h4 className="mb-3 font-semibold text-white">
              Platform
            </h4>

            <div className="flex flex-col gap-2 text-zinc-400">
              <a href="#">
                Jobs
              </a>

              <a href="#">
                Scholarships
              </a>

              <a href="#">
                Universities
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-3 font-semibold text-white">
              Resources
            </h4>

            <div className="flex flex-col gap-2 text-zinc-400">
              <a href="#">
                About
              </a>

              <a href="#">
                Contact
              </a>

              <a href="#">
                Privacy
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-zinc-900 pt-6 text-sm text-zinc-500">
        © 2026 AssamStudentHub. All
        rights reserved.
      </div>
    </footer>
  );
}
