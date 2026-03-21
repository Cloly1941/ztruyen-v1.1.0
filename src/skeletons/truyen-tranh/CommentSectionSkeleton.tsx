// ** Shadcn ui
import {Skeleton} from "@/components/ui/skeleton";
import {Separator} from "@/components/ui/separator";

const CommentSectionSkeleton = () => {
    return (
      <>
          <div className='mt-6 flex'>
              {/* Avatar */}
              <div className='mx-2 shrink-0'>
                  <Skeleton className='size-[60px] rounded-full' />
              </div>

              {/* Input */}
              <Skeleton className='w-full rounded-md' />
          </div>
          <ul className='flex flex-col gap-y-5 mt-10'>
              {Array.from({ length: 5 }).map((_, i) => (
                  <li key={i}>
                      {/* Avatar + Username */}
                      <div className='flex items-start'>
                          <div className='mx-2'>
                              <Skeleton className='size-[60px] rounded-full' />
                          </div>
                          <Skeleton className='h-4 w-28 mt-4' />
                      </div>

                      {/* Content block */}
                      <div className='ml-[76px]'>
                          {/* Comment content */}
                          <div className='-mt-6 space-y-2'>
                              <Skeleton className='h-4 w-full' />
                              <Skeleton className='h-4 w-3/4' />
                          </div>

                          {/* Meta: date + like + reply */}
                          <div className='flex gap-5 mt-2'>
                              <Skeleton className='h-3 w-24' />
                              <Skeleton className='h-3 w-10' />
                              <Skeleton className='h-3 w-14' />
                          </div>

                          <Separator className='bg-[#E3E5E7] dark:bg-zinc-700 mt-6' />
                      </div>
                  </li>
              ))}
          </ul>
      </>
    )
}

export default CommentSectionSkeleton