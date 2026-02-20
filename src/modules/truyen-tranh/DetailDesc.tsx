// ** Shadcn ui
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

type TDetailDescProps = {
    desc: string
}

const DetailDesc = ({desc}: TDetailDescProps) => {

    return (
      <>
          <div className='hidden md:block'>
              <Tooltip>
                  <TooltipTrigger asChild>
                      <div
                          dangerouslySetInnerHTML={{__html: desc}}
                          className="text-sm text-black/75 dark:text-white md:line-clamp-2 cursor-help mt-4"
                      />
                  </TooltipTrigger>

                  <TooltipContent className='max-w-xl lg:max-w-3xl'>
                      <div
                          dangerouslySetInnerHTML={{__html: desc}}
                          className="text-sm cursor-help [&_p]:w-full"
                      />
                  </TooltipContent>
              </Tooltip>
          </div>
          <div
              dangerouslySetInnerHTML={{__html: desc}}
              className="text-sm text-black/75 dark:text-white mt-4 block md:hidden"
          />
      </>
    )
}

export default DetailDesc;