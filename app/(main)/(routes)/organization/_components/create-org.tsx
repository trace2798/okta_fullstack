"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { HoverContentComponent } from "./hover-content-component";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { redirect, useParams, useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Org } from "@prisma/client";
import {  useSession } from "next-auth/react";


const formSchema = z.object({
  name: z.string().min(2).max(50),
  domain: z.string().min(2).max(50),
  issuer: z.string().optional(),
  authorization_endpoint: z.string().optional(),
  token_endpoint: z.string().optional(),
  userinfo_endpoint: z.string().optional(),
  client_id: z.string().optional(),
  client_secret: z.string().optional(),
  apikey: z.string().min(6),
});

interface CreateOrgFormProps {}

export const CreateOrg: React.FC<CreateOrgFormProps> = ({}) => {
  const session = useSession();
  if (!session) {
    redirect("/");
  }
  console.log(session);
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      domain: "",
      issuer: "",
      authorization_endpoint: "",
      token_endpoint: "",
      userinfo_endpoint: "",
      client_id: session.data?.user?.name || "",
      client_secret: "",
      apikey: "",
    },
  });

  type FormData = z.infer<typeof formSchema>;

  const onSubmit: SubmitHandler<FormData> = async (values) => {
    try {
      setLoading(true);
      const response = await axios.post(`/api/org`, values);
      console.log(values, "VALUES VALUES");
      console.log(response);
      form.reset();
      toast({
        title: "Organizarion Data Added",
        description: "Organization Data Successfully Added",
        // variant: "special",
      });
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to submit data",
        description: "Make sure all fields are filled up.",
        variant: "destructive",
      });
    }
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Add Organization</Button>
      </SheetTrigger>
      <SheetContent className="w-full md:w-[50%] lg::w-[25%]" side="right">
        <SheetHeader>
          <SheetTitle>Add New Organization</SheetTitle>
          <SheetDescription>Basic information</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col w-full grid-cols-12 gap-2 px-2 py-4 mt-5 border rounded-lg md:px-4 focus-within:shadow-sm"
          >
            <HoverCard openDelay={200}>
              <HoverCardTrigger asChild>
                <Label htmlFor="domain" className="text-left w-fit">
                  Name (required)
                </Label>
              </HoverCardTrigger>
              <HoverCardContent
                align="start"
                className="w-[260px] text-sm"
                side="left"
              >
                <HoverContentComponent type="Name of the Organization" />
              </HoverCardContent>
            </HoverCard>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Org's name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <HoverCard openDelay={200}>
              <HoverCardTrigger asChild>
                <Label htmlFor="domain" className="text-left w-fit">
                  Domain (required)
                </Label>
              </HoverCardTrigger>
              <HoverCardContent
                align="start"
                className="w-[260px] text-sm"
                side="left"
              >
                <HoverContentComponent type="Domain of the Organization" />
              </HoverCardContent>
            </HoverCard>
            <FormField
              control={form.control}
              name="domain"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Org's domain" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <HoverCard openDelay={200}>
              <HoverCardTrigger asChild>
                <Label htmlFor="apikey" className="text-left w-fit">
                  API KEY (required)
                </Label>
              </HoverCardTrigger>
              <HoverCardContent
                align="start"
                className="w-[260px] text-sm"
                side="left"
              >
                <HoverContentComponent type="Api Key of the Organization" />
              </HoverCardContent>
            </HoverCard>
            <FormField
              control={form.control}
              name="apikey"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Org's domain" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="mt-5" disabled={isLoading}>
              Submit
            </Button>
          </form>
        </Form>

        <SheetFooter className="mt-10">
          <SheetClose asChild>
            <Button type="submit">Close form</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
