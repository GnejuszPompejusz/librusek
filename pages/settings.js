import Layout from "@/components/layout";
import { upperFirst } from "@/lib/utils";
import { useTheme } from "next-themes";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const themes = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
    "dim",
    "nord",
    "sunset",
  ];

  return (
    <Layout>
      <dialog id="cacheClear" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
          <h3 class="text-lg font-bold">Success!</h3>
          <span>
            The application request cache has been cleared successfully.
          </span>
          <div class="modal-action">
            <form method="dialog">
              <button class="btn">Close</button>
            </form>
          </div>
        </div>
        <form method="dialog" class="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      <dialog id="themesBrowser" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <h3 class="text-lg font-bold">Themes browser</h3>
              <span>Explore custom themes and choose the one you like!</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {themes.map((x) => (
                <div
                  key={x}
                  class="border-base-content/20 hover:border-base-content/40 overflow-hidden rounded-lg border outline outline-2 outline-offset-2 outline-transparent"
                  onClick={() => setTheme(x)}
                >
                  <div
                    data-theme={x}
                    class="bg-base-100 text-base-content w-full cursor-pointer font-sans"
                  >
                    <div class="grid grid-cols-12 grid-rows-3">
                      <div class="bg-base-200 col-start-1 row-span-2 row-start-1"></div>
                      <div class="bg-base-300 col-start-1 row-start-3"></div>
                      <div class="bg-base-100 col-span-10 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2">
                        <div class="font-bold">{x}</div>
                        <div class="flex flex-wrap gap-1">
                          <div class="bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                            <div class="text-primary-content text-sm font-bold">
                              A
                            </div>
                          </div>
                          <div class="bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                            <div class="text-secondary-content text-sm font-bold">
                              A
                            </div>
                          </div>
                          <div class="bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                            <div class="text-accent-content text-sm font-bold">
                              A
                            </div>
                          </div>
                          <div class="bg-neutral flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                            <div class="text-neutral-content text-sm font-bold">
                              A
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div class="modal-action">
            <form method="dialog">
              <button class="btn">Close</button>
            </form>
          </div>
        </div>
        <form method="dialog" class="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col">
          <div className="flex flex-col">
            <span className="text-3xl font-semibold">Appearance</span>
            <span className="text-lg">
              Customize the appearance of the application to your liking.
            </span>
          </div>
          <div className="divider my-1"></div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-2">
              <div className="flex flex-col">
                <span className="text-lg font-semibold">Standard themes</span>
                <span className="text-sm">
                  Choose between light and dark mode.
                </span>
              </div>
              <div className="flex flex-row gap-2">
                {["system", "light", "dark"].map((x) => (
                  <button
                    key={x}
                    className={`btn ${x == theme && "btn-primary"}`}
                    onClick={() => setTheme(x)}
                  >
                    {upperFirst(x)}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-2">
              <div className="flex flex-col">
                <span className="text-lg font-semibold">Custom themes</span>
                <span className="text-sm">
                  Choose between different more custom themes.
                </span>
              </div>
              <button
                className={`btn btn-primary`}
                onClick={() =>
                  document.getElementById("themesBrowser").showModal()
                }
              >
                Explore
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-col">
            <span className="text-3xl font-semibold">Advanced settings</span>
            <span className="text-lg">
              Advanced options for development and debugging.
            </span>
          </div>
          <div className="divider my-1"></div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-2">
              <div className="flex flex-col">
                <span className="text-lg font-semibold">Developer mode</span>
                <span className="text-sm">
                  Enable &quot;Developer&quot; page with advanced features for
                  debugging.
                </span>
              </div>
              <div className="flex flex-row gap-2">
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  defaultChecked={localStorage.getItem("developer") === "true"}
                  onClick={(e) => {
                    if (e.target.checked) {
                      localStorage.setItem("developer", "true");
                    } else {
                      localStorage.removeItem("developer");
                    }
                    window.location.reload();
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-2">
              <div className="flex flex-col">
                <span className="text-lg font-semibold">Clear cache</span>
                <span className="text-sm">
                  Clear application request cache to get fresh data
                </span>
              </div>
              <button
                className={`btn btn-error`}
                onClick={() => {
                  sessionStorage.removeItem("requestCache");
                  document.getElementById("cacheClear").showModal();
                }}
              >
                Clear cache
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default Settings;
