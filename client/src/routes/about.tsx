import { Title } from "@/design-system/components";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: () => (
    <div className="flex w-full justify-center py-16">
      <div className="w-8/12 space-y-8">
        <Title variant="article">Story Builder</Title>
        <p>
          Story Builder is a free open-source web-based application. It allows
          its users to create and play original choose-your-own-adventure
          stories.
        </p>

        <Title variant="section">Local-first</Title>
        <p>
          Story Builder is designed to be local-first. This means that by
          default data is only stored locally. We don't store{" "}
          <strong>anything</strong> on our servers, apart from user information
          (username, email and password) unless you manually save it.
        </p>
        <p>We do this for 3 reasons:</p>
        <ul className="space-y-8">
          <li>
            <strong>Cloud native shouldn't be the default</strong>. We feel like
            most web applications make an excessive number of network requests.
            We believe that applications can offer great user experience without
            being connected all the time. By quitting spamming the network every
            time you click on a button, we save bandwidth and give you back
            control over the application.
          </li>
          <li>
            <strong>Control over your data</strong>. Your data stays on your
            device until you decide otherwise.
          </li>
          <li>
            This also allows the application to be fully working{" "}
            <strong>without needing internet connection</strong>.
          </li>
        </ul>

        <Title variant="sub-section">How do we store your data?</Title>
        <p>
          Basically, every action performed on the application is automatically
          saved in a local database. This database is tied to a specific
          browser, meaning that on the same computer,{" "}
          <strong>
            each browser (firefox, chrome, safari...) is treated like a
            different device
          </strong>
          .
        </p>
        <p>
          Then, when you save data on the cloud, we use a traditional
          cloud-based database.
        </p>

        <Title variant="sub-section">Caveats</Title>
        <p>
          Being local-first means that your progress, your on-going games and
          the stories you create are only saved on your device until you
          specifically save your data. This loses some of the comfort we are
          used to on most web-based applications, but we believe that in order
          to keep away from the fast-paced technological capitalism and
          consumerism, we sometimes need to make a little extra effort.
        </p>
      </div>
    </div>
  ),
});
