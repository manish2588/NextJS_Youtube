import Sidebar from "./components/Sidebar";
import VideoGrid from "./components/VideoGrid";
import ContentWrapper from "./components/ContentWrapper";

export default function HomePage() {
  return (
    <div className="flex">
      {/* Sidebar (client) */}
      <Sidebar />

      {/* Main Content (server + client wrapper for margin) */}
      <ContentWrapper>
        <VideoGrid />
      </ContentWrapper>
    </div>
  );
}
