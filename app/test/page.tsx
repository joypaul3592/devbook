"use client";

import { HomeIcon } from "@/components/icons/Icons";
import { ThemeToggle } from "@/components/ui";
import { FileUpload } from "@/components/ui/fileUpload/FileUpload";
import { Input } from "@/components/ui/input/Input";
import { Select } from "@/components/ui/select/Select";
import SimpleSelect from "@/components/ui/select/SimpleSelect";
import { Textarea } from "@/components/ui/textarea/Textarea";
import { Table } from "@/components/ui/table/Table";
import { Calendar } from "@/components/ui/calender/Calender";
import { Checkbox } from "@/components/ui/checkbox/Checkbox";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@/components/ui/dropdown/Dropdown";
import { Modal } from "@/components/ui/modal/Modal";
import { SimpleTooltip } from "@/components/ui/tooltip/Tooltip";
import { ToggleSwitch } from "@/components/ui/toggle/ToggleSwitch";
import { useState } from "react";
import { Button } from "@/components/button/Button";

export default function TestPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    { id: "name" as const, header: "Name" },
    { id: "email" as const, header: "Email" },
    { id: "role" as const, header: "Role" },
  ];

  const dummyData = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: i % 3 === 0 ? "Admin" : "User",
  }));

  const paginatedData = dummyData.slice((page - 1) * limit, page * limit);

  return (
    <div className="w-3xl mx-auto pb-20 pt-5">
      <div className="w-full between px-4 py-2 rounded-md border border-border sticky top-0  backdrop-blur-sm z-10000! ">
        <h1 className="text-xl font-medium text-left">Test component</h1>
        <ThemeToggle />
      </div>

      <div className="py-5 space-y-5">
        <Input
          label="Test Name"
          placeholder="Enter you test name here..."
          startIcon={<HomeIcon />}
          required={true}
          helperText={"Please enter this field"}
        />
        <Input
          label="Test Name"
          placeholder="Enter you test name here..."
          startIcon={<HomeIcon />}
          required={true}
          helperText={"Please enter this field"}
        />

        <FileUpload />

        <Select
          options={[
            {
              value: "joy",
              label: "Joy Paul",
            },
            {
              value: "Duo",
              label: "Arif Sikder",
            },
            {
              value: "hpy",
              label: "Zubayer Hossain",
            },
          ]}
          startIcon={<HomeIcon />}
          className="w-full"
          label="Country"
          helperText="This is totally helperText checking"
        />
        <Textarea label="Description" placeholder="White you message in here..." />

        <SimpleSelect
          options={[
            {
              value: "joy",
              label: "Joy Paul",
            },
            {
              value: "Duo",
              label: "Arif Sikder",
            },
            {
              value: "hpy",
              label: "Zubayer Hossain",
            },
          ]}
          value=""
          onChange={function (value: string): void {
            throw new Error("Function not implemented.");
          }}
          placeholder="Select an Option"
        />
        <FileUpload />

        <div className="pt-10">
          <h2 className="text-xl font-medium mb-4">Table with Pagination</h2>
          <Table
            data={paginatedData}
            columns={columns}
            pagination={true}
            page={page}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
            totalData={dummyData.length}
            bordered={true}
          />
        </div>

        <div className="pt-10 space-y-8">
          <h2 className="text-xl font-medium mb-4">More Components</h2>

          <div className="grid grid-cols-2  gap-6 *:border-r *:border-border">
            <div>
              <h3 className="text-sm mb-2 text-accent-foreground">Calendar</h3>
              <Calendar label="Pick a Date" />
            </div>

            <div>
              <h3 className="text-sm mb-2 text-accent-foreground">Checkbox</h3>
              <Checkbox label="Accept terms and conditions" />
            </div>

            <div>
              <h3 className="text-sm mb-2 text-accent-foreground">Dropdown</h3>
              <Dropdown>
                <DropdownTrigger>Open Dropdown</DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem>Profile</DropdownItem>
                  <DropdownItem>Settings</DropdownItem>
                  <DropdownItem destructive>Logout</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>

            <div>
              <h3 className="text-sm mb-2 text-accent-foreground">Modal</h3>
              <Button onClick={() => setIsModalOpen(true)} size={"sm"}>
                Open Modal
              </Button>

              <Modal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Example Modal"
                description="This is a description for the modal."
                footer={
                  <Button onClick={() => setIsModalOpen(false)} size={"sm"}>
                    Close
                  </Button>
                }
              >
                <p>Here is some content inside the modal!</p>
              </Modal>
            </div>

            <div>
              <h3 className="text-sm mb-2 text-accent-foreground">Tooltip</h3>
              <SimpleTooltip content="This tooltip!">
                <Button variant="outline">Hover me</Button>
              </SimpleTooltip>
            </div>

            <div>
              <h3 className="text-sm mb-2 text-accent-foreground">Toggle Switch</h3>
              <ToggleSwitch label="Enable notifications" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
