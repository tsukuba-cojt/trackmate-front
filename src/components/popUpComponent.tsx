import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type Props = {
  isOpen: boolean,
  onClose: () => void,
  errorMessage: string, 
  imgPath: string
}

export function PopUpComponent({isOpen, onClose, errorMessage, imgPath}: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white" aria-describedby={undefined} showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{errorMessage}</DialogTitle>
        </DialogHeader>
        <DialogDescription></DialogDescription>
        <div className="flex justify-center items-center gap-2">
          {imgPath && <img src={imgPath} alt="" className="w-1/4"/>}
        </div>
      </DialogContent>
    </Dialog>
  )
}
