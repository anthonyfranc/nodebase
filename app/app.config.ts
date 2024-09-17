export default defineAppConfig({
  ui: {
    primary: 'green',
    gray: 'zinc',
    fonts: {
      sans: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'
    },
    card: {
      ring: 'ring-1 ring-gray-200 dark:ring-gray-800',
      rounded: 'rounded-md',
      shadow: ''
    },
    modal: {
      wrapper: 'relative z-50',
      inner: 'fixed inset-0 overflow-y-auto',
      container: 'flex min-h-full items-end sm:items-center justify-center text-center',
      padding: 'p-4 sm:p-0',
      margin: 'sm:my-8',
      base: 'relative text-left rtl:text-right flex flex-col',
      overlay: {
        base: 'fixed inset-0 transition-opacity ease-out duration-300', // Updated here
        background: 'bg-gray-900/70 dark:bg-gray-800/75',
        transition: {
          default: 'transition-opacity ease-out duration-300',
          enter: 'ease-out duration-300',
          enterFrom: 'opacity-0',
          enterTo: 'opacity-100',
          leave: 'ease-in duration-200',
          leaveFrom: 'opacity-100',
          leaveTo: 'opacity-0',
        },
      },
      background: 'bg-white dark:bg-gray-900',
      ring: '',
      rounded: 'rounded-sm',
      shadow: '',
      width: 'w-full sm:max-w-lg',
      height: '',
      fullscreen: 'w-screen h-screen',
      transition: {
        enter: 'ease-out duration-300',
        enterFrom: 'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95',
        enterTo: 'opacity-100 translate-y-0 sm:scale-100',
        leave: 'ease-in duration-200',
        leaveFrom: 'opacity-100 translate-y-0 sm:scale-100',
        leaveTo: 'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95',
      },
    }
  }
})
