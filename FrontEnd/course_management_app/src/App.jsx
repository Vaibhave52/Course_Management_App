import { Route, Routes } from "react-router-dom";
import AdminLayout from "./Components/AdminLayout";
import CourseCoordinatorLayout from "./Components/CourseCoordinatorLayout";
import PageNotFound from "./Pages/PageNotFound";
import CourseType from "./Pages/CourseType";
import Infrastructure from "./Pages/Infrastructure";
import Sessions from "./Pages/Sessions";
import CourseGroup from "./Pages/CourseGroup";
import CoursePage from "./Pages/CoursePage";
import SubjectPage from "./Pages/SubjectPage";
import SectionPage from "./Pages/SectionPage";
import TopicPage from "./Pages/TopicPage";
import RecordedVideo from "./Pages/RecordedVideo";
import StudentPage from "./Pages/StudentPage";
import { AuthProvider } from "./Services/AuthContext";
import Login from "./Pages/Login";
import ProtectedRoute from "./Pages/ProtectedRoute";
import { ScheduleWithLayout } from "./Pages/ScheduleWithLayout";
import Unauthorized from "./Pages/Unauthorized";
import Premises from "./Pages/Premises";
import Role from "./Pages/Role";
import MenuItem from "./Pages/MenuItems";
import Certificate from "./Pages/Certificate";
import BatchCycle from "./Pages/BatchCycle";
import Staff from "./Pages/Staff";
import CourseModulePage from "./Pages/CourseModulePage";
import AxiosInterceptor from "./Services/AxiosInterceptor";

function App() {
  return (
    <AuthProvider>
      {/* Mount Axios Interceptor globally */}
      <AxiosInterceptor />

      <Routes>
        {/* Default Login */}

        <Route path="/" element={<Login />} />

        {/* Admin Layout */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/batch-cycle" element={<BatchCycle />} />
          <Route path="/course-type" element={<CourseType />} />
          <Route path="/infrastructure" element={<Infrastructure />} />
          <Route path="/course" element={<CoursePage />} />
          <Route path="/subject" element={<SubjectPage />} />
          <Route path="/sections/:subjectId" element={<SectionPage />} />
          <Route path="/topics/:sectionId" element={<TopicPage />} />
          <Route path="/roles" element={<Role />} />
          <Route path="/premises" element={<Premises />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/menu-items" element={<MenuItem />} />
        </Route>

        {/* Coordinator Routes */}

        <Route
          element={
            <ProtectedRoute allowedRoles={["COORDINATOR"]}>
              <CourseCoordinatorLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/certificate" element={<Certificate />} />
          <Route path="/course-group" element={<CourseGroup />} />
          <Route path="/recorded-video" element={<RecordedVideo />} />
          <Route path="/student" element={<StudentPage />} />
          <Route path="/modules" element={<CourseModulePage />} />
        </Route>

        {/* Shared schedule route for both roles */}
        <Route path="/schedule" element={<ScheduleWithLayout />} />

        {/* Unauthorized */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Fallback */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
