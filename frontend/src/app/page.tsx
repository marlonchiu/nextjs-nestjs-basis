import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function Home() {
  return (
    <div className="h-screen flex justify-center items-center">
      <form className="w-full max-w-md flex flex-col gap-4">
        <h1 className="text-center text-2xl font-bold">App Name</h1>
        <Input name="name" placeholder="App Name"></Input>
        <Textarea name="description" placeholder="App Description" />
        <Button type="submit">Submit</Button>
      </form>
    </div>
  )
}
