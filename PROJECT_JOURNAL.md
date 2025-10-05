# inPEP Development Journal

## Project Overview
**Name:** inPEP (Integrated Patient Engagement Platform)  
**Parent Company:** Indigo International  
**Type:** Cloud-based SaaS Healthcare Platform  
**Target:** Hospitals, Health Insurers, Patients, Caregivers  

---

## Development Sessions

### Session 1: October 5, 2025 - Foundation & Authentication

#### What We Built:
1. **Backend Infrastructure**
   - Node.js + Express + TypeScript
   - SQLite database (will migrate to PostgreSQL for AWS)
   - Prisma ORM
   - JWT authentication
   - Role-based access control (PATIENT, CAREGIVER, PROVIDER, INSURER)

2. **Frontend Foundation**
   - React + Vite + TypeScript
   - Material-UI components
   - Authentication system with real API integration
   - 4 role-specific dashboards

3. **Appointments System (Complete)**
   - Database schema with Appointment model
   - 6 API endpoints (GET, POST, PUT, PATCH, DELETE)
   - Patient dashboard integration
   - Caregiver calendar integration
   - Provider management interface
   - Real-time data from database

#### Key Decisions:
- ✅ SQLite for development, PostgreSQL for production
- ✅ JWT tokens for authentication
- ✅ Role-based access: PATIENT, CAREGIVER, PROVIDER, INSURER
- ✅ Monorepo structure (frontend + backend)
- ✅ AWS for deployment (future)

#### Test Accounts Created:
```
Patient:    patient@test.com / password123
Caregiver:  caregiver@test.com / password123
Provider:   provider@test.com / password123
Insurer:    insurer@test.com / password123
```

#### Technical Stack:
**Frontend:**
- React 18
- TypeScript
- Material-UI (MUI)
- React Router
- Vite

**Backend:**
- Node.js
- Express
- TypeScript
- Prisma ORM
- SQLite (dev) → PostgreSQL (prod)
- JWT authentication
- bcrypt for password hashing

**Deployment Plan:**
- AWS Amplify (Frontend)
- AWS Elastic Beanstalk (Backend)
- AWS RDS PostgreSQL (Database)
- Domain: app.indigointernational.com

#### Features Completed:
- [x] User authentication (register, login, profile)
- [x] Role-based dashboards (4 types)
- [x] Appointments system (full CRUD)
- [x] Patient appointment viewing
- [x] Caregiver calendar integration
- [x] Provider appointment management
- [x] Navigation system with role-based menus

#### Next Steps Discussed:
1. **Messaging System** - Real-time chat (2-3 days)
2. **AI Health Insights** - Trend analysis, predictions (3-4 days)
3. **Medical Records** - Document management (2-3 days)
4. **Heredibles™ Enhancement** - AI meal planning (4-5 days)
5. **ReclaiMe™ Completion** - Caregiver wellness (3-4 days)

#### Strategic Goals:
- Build investor-ready MVP
- Focus on unique differentiators (Heredibles™, ReclaiMe™)
- Prepare for AWS deployment
- Target: 5 weeks to investor-ready product

#### AWS Deployment Strategy:
**MVP Phase:**
- Cost: ~$0-30/month (free tier)
- Frontend: AWS Amplify
- Backend: AWS Elastic Beanstalk
- Database: AWS RDS PostgreSQL (db.t3.micro)

**Production Phase (Post-Funding):**
- Cost: ~$200-500/month
- Scalable architecture
- Multi-region deployment
- HIPAA compliance ready

#### Key Insights:
- inPEP is a 4-stakeholder platform (unique positioning)
- Heredibles™ and ReclaiMe™ are proprietary features
- Platform will integrate with hospital EMR systems (HL7/FHIR)
- Mobile apps planned (React Native for code reuse)
- Target market: US healthcare (HIPAA) + international

---

## Technical Decisions Log

### Database
- **Development:** SQLite (file-based, easy setup)
- **Production:** PostgreSQL on AWS RDS
- **Reason:** SQLite perfect for dev, PostgreSQL needed for cloud deployment

### Authentication
- **Method:** JWT tokens
- **Storage:** localStorage (frontend), httpOnly cookies (future enhancement)
- **Security:** bcrypt password hashing, role-based access control

### Architecture
- **Pattern:** Monorepo (frontend + backend in same project)
- **API:** RESTful (future: GraphQL for mobile)
- **State Management:** React Context API (future: Redux if needed)

### Deployment
- **Platform:** AWS (chosen for scalability, HIPAA compliance)
- **Domain Structure:**
  - indigointernational.com (corporate)
  - app.indigointernational.com (inPEP web app)
  - api.indigointernational.com (backend API)

---

## Feature Roadmap

### Phase 1: Core MVP (Weeks 1-2)
- [x] Authentication system
- [x] Appointments management
- [ ] Messaging system
- [ ] Medical records
- [ ] Medication tracking
- [ ] Vitals tracking

### Phase 2: Differentiators (Weeks 3-4)
- [ ] AI health insights
- [ ] Complete Heredibles™
- [ ] Complete ReclaiMe™
- [ ] Analytics dashboards

### Phase 3: Polish & Deploy (Week 5)
- [ ] UI/UX refinement
- [ ] AWS deployment
- [ ] Demo scenarios
- [ ] Performance optimization

### Phase 4: Post-Funding
- [ ] Hospital EMR integration (HL7/FHIR)
- [ ] Mobile apps (React Native)
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] HIPAA compliance certification

---

## Resources & Documentation

### Project Files:
- `HOW_TO_LOGIN.md` - Login guide with test accounts
- `TESTING_GUIDE.md` - Backend testing procedures
- `SETUP_BACKEND.md` - Backend setup instructions
- `APPOINTMENTS_SYSTEM.md` - Appointments implementation
- `APPOINTMENTS_COMPLETE.md` - Complete appointments docs

### External Resources:
- AWS Documentation: https://docs.aws.amazon.com
- Prisma Docs: https://www.prisma.io/docs
- React Docs: https://react.dev
- Material-UI: https://mui.com

---

## Notes & Reminders

### Important Considerations:
- **HIPAA Compliance:** Required for US market (AWS has HIPAA-eligible services)
- **Data Security:** Encrypt at rest and in transit
- **Scalability:** Architecture supports 10,000+ users
- **Integration:** HL7/FHIR standards for hospital EMR systems
- **Mobile:** React Native allows code reuse from web app

### Business Context:
- inPEP = Integrated Patient Engagement Platform
- Parent company: Indigo International
- Revenue model: SaaS (hospitals/insurers pay, patients/caregivers free)
- Unique features: Heredibles™ (meal planning), ReclaiMe™ (caregiver wellness)

### Development Philosophy:
- Build for investors (focus on wow factor)
- Prioritize unique differentiators
- Professional polish matters
- Scalability from day one
- Security and compliance ready

---

## Session Notes

### October 5, 2025
**Focus:** Backend setup, authentication, appointments system

**Achievements:**
- Complete backend infrastructure
- Working authentication with 4 user roles
- Full appointments CRUD system
- 3 dashboards connected to real API

**Challenges Solved:**
- Role format mismatch (Title Case vs UPPERCASE)
- Navigation menu not showing (role check issue)
- API integration and error handling

**Time Invested:** ~6 hours
**Lines of Code:** ~5,000+
**Files Created:** 50+

**Key Learnings:**
- Prisma makes database management easy
- Role-based access needs careful planning
- TypeScript catches errors early
- Material-UI speeds up UI development

---

## Future Sessions

### Next Session Goals:
1. Build messaging system
2. Add AI health insights
3. Complete Heredibles™ feature
4. Prepare for AWS deployment

### Questions to Address:
- [ ] Which AI service to use? (AWS SageMaker, OpenAI, custom?)
- [ ] Message encryption strategy?
- [ ] File upload limits for medical records?
- [ ] Mobile app timeline?

---

## Contact & Resources

**Developer:** [Your Name]
**Project Start:** October 5, 2025
**Target Launch:** [TBD - Based on investor timeline]
**Repository:** [Git URL when created]

---

*This journal will be updated after each development session to track progress, decisions, and learnings.*
