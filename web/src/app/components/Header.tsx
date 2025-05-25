import { link } from "@/app/shared/links";
import { Avatar, AvatarFallback } from "./ui/avatar";

const Header = () => {
  return (
    <header className="py-5 px-page-side h-20 flex justify-between items-center border-b-1 border-border mb-12">
      {/* left side */}
      <div className="flex items-center gap-8">
        <a
          href={link("/")}
          className="flex items-center gap-3 font-display font-bold text-3xl"
        >
          <img src="/images/logo.svg" alt="Apply Wize" className="pt-5 -mb-3" />
          <span>Apply Wize</span>
        </a>
        <nav>
          <ul>
            <li>
              <a href={link("/applications")}>Dashboard</a>
            </li>
          </ul>
        </nav>
      </div>

      {/* right side */}
      <nav>
        <ul className="flex items-center gap-7">
          <li>
            <a href="#">Settings</a>
          </li>
          <li>
            <a href={link("/user/logout")}>Logout</a>
          </li>
          <li>
            <Avatar>
              <AvatarFallback>R</AvatarFallback>
            </Avatar>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export { Header };
