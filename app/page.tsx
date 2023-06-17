'use client'
import { Card } from "flowbite-react";
import ActionBar from "./components/app-bar"
import Link from "next/link";


export default function Page() {

  return (
    <center>
      <ActionBar />
      <div className="max-w-3xl">
        {
          [...new Array(10)].map((_, index) =>
            <Link href="/" key={index}>
              <Card className="my-5">
                <div className="flex">
                  <div className="text-left">
                    <h6 className="text-3xl tracking-tight">Titel</h6>
                    <p className="text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                  </div>
                  <img src="https://picsum.photos/100" width={100} />
                </div>
              </Card>
            </Link>
          )}
      </div>
    </center>
  )
}