import { RouteObject } from "react-router-dom";
import Login from "src/content/login";
import BaseLayout from "src/layouts/BaseLayout";
import SuspenseLoader from 'src/components/SuspenseLoader';
import { lazy, Suspense } from "react";
import UserEdit from "src/content/applications/Users/UserEdit";
import UpdateCorporateEmail from "src/content/applications/UpdateCorporateEmail";
import ChangePassword from "src/content/applications/ChangePassword";
import LandingPage from "src/content/applications/LandingPage";

import AuditLog from "src/content/applications/AuditLog";
import Landing from "src/content/applications/Landing";
import DocumentClassAccessManagement from "src/content/applications/DocumentClassAccessManagement";
import VerifyAccessRight from "src/content/applications/VerifyAccessRight";
import ApproveAccessRight from "src/content/applications/ApproveAccessRight";
import RetrieveRecord from "src/content/applications/RetrieveRecord";
import MaintainDocumentClass from "src/content/applications/MaintainDocumentClass";
import MaintainSystemParameters from "src/content/applications/MaintainSystemParameters";
import ImportTasksMaintain from "src/content/applications/ImportTasksMaintain";
import EditImportTasksMaintain from "src/content/applications/ImportTasksMaintain/ViewEditImportTasks";
import ImportTasksEnquiry from "src/content/applications/ImportTasksEnquiry";
import RetrieveReports from "src/content/applications/RetrieveReports";
import SearchDisposalDate from "src/content/applications/SearchDisposalDate";
import UserProfile from "src/content/applications/UserProfile";
import EditUserProfile from "src/content/applications/UserProfile/EditUserProfile";
import ReportContainer from "src/content/applications/RetrieveReports/ReportContainer";

import ErrorPage403 from "src/content/applications/ErrorPage403";
import ErrorPage401 from "src/content/applications/ErrorPage401";
import PlainLayout from "src/layouts/PlainLayout";
import OnlineHelp from "src/content/applications/OnlineHelp";
import Dashboard from "src/content/applications/Dashboard"
import ProtectedLayout from "src/layouts/ProtectedLayout";
import CaseLayout from "src/layouts/ProtectedLayout/CaseLayout";
import CaseParticular from "src/content/applications/CaseParticular";
import Complainant from "src/content/applications/Complainant";
import Complainee from "src/content/applications/Complainee";
import ComplainantLayout from "src/layouts/ProtectedLayout/ComplainantLayout";
import ComParticular from "src/content/applications/Complainant/ComParticulars";
import ComContactMean from "src/content/applications/Complainant/ComContactMean/ComContactMean";
import ComOther from "src/content/applications/Complainant/ComOther";
import ComMAndC from "src/content/applications/Complainant/ComMAndC";
import ComRelationship from "src/content/applications/Complainant/ComRelationship";

import RichTextEditor from "src/components/RichTextEditor2";
import IpccCase from "src/content/applications/IPCC";
import CarpoCaseDetail from "src/content/applications/CarpoCaseDetail";
const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

const User = Loader(
    lazy(() => import('src/content/applications/Users'))
  );

export const pageRoutes: RouteObject[] = [
    {
        element: <BaseLayout />,
        children: [
            {
                path: 'rich-text-editor',
                element: <RichTextEditor />
            },
            {
                path: 'login',
                element: <Login />
            },
            {
                path: 'landing',
                element: <Landing />
            },
            {
                path: 'welcome',
                element: <LandingPage />
            }
        ]
    },
    {
        element: <PlainLayout />,
            children: [{
                path: 'error/403',
                element: <ErrorPage403 />
            }
        ]
    },
    {
        element: <PlainLayout />,
            children: [{
                path: 'error/401',
                element: <ErrorPage401 />
            }
        ]
    },
    {
        element: <ProtectedLayout/>,
        children: [
            {   
                element: <CaseLayout />,
                children: [
                    {
                        path: 'case-particular',
                        element: <CaseParticular />
                    },
                    {
                        element: <ComplainantLayout/>,
                        children: [
                            {
                                path: 'com-particular',
                                element: <ComParticular />
                            },
                            {
                                path: 'com-contact-mean',
                                element: <ComContactMean />
                            },
                            {
                                path: 'com-other',
                                element: <ComOther />
                            },
                            {
                                path: 'com-m-and-c',
                                element: <ComMAndC />
                            },
                            {
                                path: 'com-relationship',
                                element: <ComRelationship />
                            },
                        ]
                    },
                    {
                        path: 'complainee',
                        element: <Complainee />
                    },
                ]
            },
            {
                path: 'carpo',
                element: <CarpoCaseDetail />
            },
            {
                path: 'dashboard',
                element: <Dashboard />
            },
            {
                path: 'verify-access-right',
                element: <VerifyAccessRight />
            },
            {
                path: 'approve-access-right',
                element: <ApproveAccessRight />
            },
            {
                path: 'retrieve-record',
                element: <RetrieveRecord />
            },
            {
                path: 'user-management',
                element: <User />
            },
            {
                path: 'user-profile',
                element: <UserProfile />
            },
         
            {
                path: 'user-profile/:id',
                element: <EditUserProfile />
            },
            {
                path: 'document-class-access',
                element: <DocumentClassAccessManagement searchType="ALL"/>
            },
            {
                path: 'maintain-document-class',
                element: <MaintainDocumentClass />
            },
            {
                path: 'maintain-system-parameters',
                element: <MaintainSystemParameters />
            },
            {
                path: 'import-tasks-maintain',
                element: <ImportTasksMaintain />
            },
            {
                path: 'import-tasks-maintain/:id',
                element: <EditImportTasksMaintain />
            },
            {
                path: 'import-tasks-enquiry',
                element: <ImportTasksEnquiry />
            },
            {
                path: 'search-disposal-date',
                element: <SearchDisposalDate searchType="ALL"/>
            },
            {
                path: 'user-management/:id',
                element: <UserEdit/>
            },
            {
                path: 'corporate-email/update',
                children: [
                    {
                        path: '',
                        element: <UpdateCorporateEmail />
                    }
                ]
            },
            {
                path: 'password/change',
                children: [
                    {
                        path: '',
                        element: <ChangePassword />
                    }
                ]
            },
            {
                path: 'audit-log/search',
                children: [
                    {
                        path: '',
                        element: <AuditLog />
                    }
                ]
            },
            {
                path: 'online-help',
                children: [
                    {
                        path: '',
                        element: <OnlineHelp />
                    }
                ]
            },
            {
                path: 'retrieve-reports',
                children: [
                    {
                        path: '',
                        element: <RetrieveReports />
                    },
                    {
                        path: ":reportId",
                        element: <ReportContainer />
                    }
                ]
            }
        ]
    }
];