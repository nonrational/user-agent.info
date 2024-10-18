// With compliments to Creative Tim – https://www.creative-tim.com?ref=tailwindcomponents
const UaInputSubmit = ({ ok, value }: { ok: boolean; value?: string }) => {
  return (
    <div class='relative flex h-10 w-full min-w-[200px] max-w-4xl'>
      <button
        class='!absolute right-1 top-1 z-10 select-none rounded bg-slate-300 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-slate-300/20 hover:shadow-lg hover:shadow-slate-300/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none peer-placeholder-shown:pointer-events-none peer-placeholder-shown:bg-blue-gray-500 peer-placeholder-shown:opacity-50 peer-placeholder-shown:shadow-none'
        type='submit'
      >
        <span style={{ textShadow: '0 0 2px white' }}>🔍</span>
      </button>
      <input
        class='peer h-full w-full rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 pr-20 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50'
        name='ua'
        value={value}
        style={{ width: '100%', wordBreak: 'break-word', resize: 'both', borderColor: ok ? null : '#b91c1c' }}
        onClick={(e) => e.currentTarget.select()}
      />
      <label class="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
        User Agent
      </label>
    </div>
  )
}

export default UaInputSubmit
