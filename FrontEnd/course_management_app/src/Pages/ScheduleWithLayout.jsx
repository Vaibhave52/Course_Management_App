import AdminLayout from "../Components/AdminLayout";
import CourseCoordinatorLayout from "../Components/CourseCoordinatorLayout";
import { useAuth } from "../Services/AuthContext";
import SchedulePage from "./SchedulePage";
import Unauthorized from "./Unauthorized";

export function ScheduleWithLayout() {
  const { auth } = useAuth(); // token, email, role

  if (!auth || !auth.role) return <Unauthorized />;

  if (auth.role === "ADMIN") {
    return (
      <AdminLayout>
        <SchedulePage viewOnly={true} /> {/* Admin: view only */}
      </AdminLayout>
    );
  }

  if (auth.role === "COORDINATOR") {
    return (
      <CourseCoordinatorLayout>
        <SchedulePage viewOnly={false} /> {/* Coordinator: CRUD */}
      </CourseCoordinatorLayout>
    );
  }

  return <Unauthorized />;
}
