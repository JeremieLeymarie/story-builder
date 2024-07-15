import { Button } from "@/design-system/primitives/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/design-system/primitives/card";
import { Link } from "@tanstack/react-router";
import { LayoutTemplateIcon, LibraryIcon, StoreIcon } from "lucide-react";

export const Home = () => {
  return (
    <Card className="w-[300px] flex flex-col justify-center items-center">
      <CardHeader>
        <CardTitle>Hello!</CardTitle>
        <CardDescription>Welcome to story-builder!</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Link to="/store">
          <Button variant="default" className="w-[200px]">
            <StoreIcon />
            &nbsp;Store
          </Button>
        </Link>
        <Link to="/library">
          <Button variant="default" className="w-[200px]">
            <LibraryIcon /> &nbsp; Library
          </Button>
        </Link>
        <Link to="/builder/stories">
          <Button variant="default" className="w-[200px]">
            <LayoutTemplateIcon /> &nbsp; Build-your-own
          </Button>
        </Link>
        <Link to="/whiteboard">
          <Button variant="default" className="w-[200px]">
            Whiteboard
          </Button>
        </Link>
      </CardContent>
      <CardFooter>
        <p>Any questions? Too bad.</p>
      </CardFooter>
    </Card>
  );
};
