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

export const Home = () => {
  return (
    <Card className="w-[300px] flex flex-col justify-center items-center">
      <CardHeader>
        <CardTitle>Hello!</CardTitle>
        <CardDescription>Welcome to story-builder!</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Link to="/stories">
          <Button variant="default" className="w-[200px]">
            Store
          </Button>
        </Link>
        <Link to="/game">
          <Button variant="default" className="w-[200px]">
            Play
          </Button>
        </Link>
        <Link to="/builder">
          <Button variant="default" className="w-[200px]">
            Build-your-own
          </Button>
        </Link>
      </CardContent>
      <CardFooter>
        <p>Any questions? Too bad.</p>
      </CardFooter>
    </Card>
  );
};
