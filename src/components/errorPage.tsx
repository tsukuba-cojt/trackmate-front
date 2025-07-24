type Props = {
  statusCode: number, 
  errorMessage: string
  
}

export default function ErrorPage({statusCode, errorMessage}: Props) {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xllg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
            <h1 className="mb-6 text-6xl tracking-tight font-extrabold lg:text-9xl text-gray-900 dark:text-primary-500">
              {statusCode}
            </h1>
            <p className="mb-4 text-xl tracking-tight font-bold text-gray-900 md:text-xl dark:text-white">
              {errorMessage}
            </p>
        </div>   
      </div>
    </section>
  )
}