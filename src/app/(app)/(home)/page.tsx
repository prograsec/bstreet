import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@radix-ui/react-checkbox";

export default function Home() {
  return (
    <div className="p-6">
      <div className="flex flex-col gap-y-4">
        <div>
          <Button variant={"elevated"}>I am a button</Button>
        </div>

        <div>
          <Input placeholder="I am an input" />
        </div>

        <div>
          <Textarea placeholder="I am a textarea" />
        </div>

        <div>
          <Progress value={50} />
        </div>

        <div>
          <Checkbox />
        </div>
      </div>
    </div>
  );
}
