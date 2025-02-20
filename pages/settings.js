import Layout from '@/components/layout';
import { upperFirst } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { useState } from 'react'

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [numberOfMessages, setHomepageMessagesLimit] = useState(
    localStorage.getItem('homepageMessagesLimit') || 3
  );

  const [messagePageLimit, setMessagesPageLimit] = useState(
    localStorage.getItem('messagesPageLimit') || 5
  );


  const handleHomepageMessagesLimitChange = value => {
    setHomepageMessagesLimit(value);
    localStorage.setItem('homepageMessagesLimit', value);
    //   window.location.reload();
  };

  const handleMessagesPageLimitChange = value => {
    setMessagesPageLimit(value);
    localStorage.setItem('messagesPageLimit', value);
    // window.location.reload();
  };

  return (
    <Layout>

      <div className='flex flex-col'>
        <span className='text-3xl font-semibold'>Librusek settings</span>
        <span className='text-lg'>Configure your Librusek settings here.</span>
      </div>
      <div className='divider my-3'></div>
      <div className='flex flex-col gap-2'>
        <div className='flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-2'>
          <div className='flex flex-col'>
            <span className='text-lg font-semibold'>Theme</span>
            <span className='text-sm'>Choose between light and dark mode.</span>
          </div>
          <div className='flex flex-row gap-2'>
            {['system', 'light', 'dark'].map(x => (
              <button
                key={x}
                className={`btn ${x == theme && 'btn-primary'}`}
                onClick={() => setTheme(x)}
              >
                {upperFirst(x)}
              </button>
            ))}
          </div>
        </div>
        <div className='flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-2'>
          <div className='flex flex-col'>
            <span className='text-lg font-semibold'>Developer mode</span>
            <span className='text-sm'>
              Enable &quot;Developer&quot; page with advanced features for
              debugging.
            </span>
          </div>
          <div className='flex flex-row gap-2'>
            <input
              type='checkbox'
              className='toggle toggle-primary'
              defaultChecked={localStorage.getItem('developer') === 'true'}
              onClick={e => {
                if (e.target.checked) {
                  localStorage.setItem('developer', 'true');
                } else {
                  localStorage.removeItem('developer');
                }
                window.location.reload();
              }}
            />
          </div>
        </div>
        {/*wiadomosci */}

        {/* Section: Maximum number of messages per page */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-2">
          {/* Description of the section */}
          <div>
            <p className="text-lg font-semibold">Maximum Messages on Message Page</p>
            <p className="text-sm">
              Set the maximum number of messages that can be displayed on the messages page.
            </p>
          </div>

          {/* Buttons to select message limit */}
          <div className="flex gap-2">
            {["2", "5", "10", "15"].map((limit) => (
              <button
                key={limit}
                className={`btn ${limit === messagePageLimit ? "btn-primary" : ""}`}
                onClick={() => handleMessagesPageLimitChange(limit)}
              >
                {limit}
              </button>
            ))}
          </div>
        </div>

        {/*wiadomosci */}
      </div>
    </Layout >
  );
};
export default Settings;
