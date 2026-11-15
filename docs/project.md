# Software Requirements Specification (SRS)
# Hybrid Car Rental & Driver Marketplace Platform

**Document Type:** Software Requirements Specification  
**Project:** Hybrid Car Rental & Driver Marketplace  
**Version:** 1.0  
**Status:** Initial Requirements Draft

---

# 1. Project Overview

## 1.1 Introduction

The proposed system is a comprehensive hybrid car rental platform that connects customers with vehicle owners, rental companies, and independent professional drivers.

The platform will support both traditional company-owned vehicle rentals and peer-to-peer vehicle rentals, allowing individual vehicle owners to register and list their vehicles for rental.

Additionally, customers will have two rental options:

1. **Self-Drive Rental:** Customers rent a vehicle and drive it themselves.
2. **Car with Driver:** Customers rent a vehicle along with a professional driver selected from the platform's registered driver marketplace.

An important business rule is that rental companies and vehicle owners are not responsible for providing drivers. Drivers operate independently through the platform. The platform recommends available drivers based on their ratings, performance, experience, and availability.

Customers can select their preferred driver from the recommended list.

The platform will manage vehicle listings, driver registrations, bookings, availability, payments, commissions, customer verification, rental operations, and business analytics through a centralized management system.

## 1.2 Project Objectives

The primary objectives are:

- Build a centralized vehicle rental marketplace.
- Allow rental companies to manage their own vehicle fleets.
- Allow individual vehicle owners to list their vehicles.
- Support both self-drive and car-with-driver rental services.
- Establish an independent driver marketplace.
- Recommend suitable drivers based on performance and ratings.
- Allow customers to select their preferred drivers.
- Automate vehicle and driver availability management.
- Provide secure booking and payment processing.
- Enable administrators to manage the entire platform.
- Generate revenue through rental commissions, driver service commissions, and other configurable fees.

---

# 2. Business Model

The platform will operate through three primary service providers.

## 2.1 Rental Companies

Rental companies can register their businesses and manage their own vehicle fleets.

Responsibilities and capabilities:

- Register as a rental company.
- Submit company verification documents.
- Create and manage vehicle listings.
- Set rental prices.
- Define vehicle availability.
- Manage incoming booking requests.
- Manage vehicle pickup and return operations.
- View rental revenue and transaction history.
- Manage vehicle maintenance.

**Important business rule:** Rental companies are responsible only for providing rental vehicles. They do not provide drivers through the rental company service.

When a customer selects the car-with-driver option, the platform independently recommends registered drivers.

## 2.2 Individual Vehicle Owners

Individual vehicle owners can register and rent out their personal vehicles.

Responsibilities and capabilities:

- Register as an individual vehicle owner.
- Submit identity and vehicle ownership documents.
- Add vehicles to the marketplace.
- Upload vehicle images and specifications.
- Set daily, weekly, and monthly rental prices.
- Manage vehicle availability.
- Receive and manage booking requests.
- View booking history and earnings.
- Manage vehicle maintenance and availability restrictions.

Owners can decide whether to accept automatic bookings or manually approve booking requests, subject to platform policies.

Vehicle owners are not required to provide drivers.

## 2.3 Independent Drivers

Drivers will operate as independent service providers within the platform.

They will have a dedicated driver registration and management system.

Responsibilities and capabilities:

- Register as a professional driver.
- Submit personal identification documents.
- Upload driving license information.
- Submit relevant experience and qualifications.
- Set service locations.
- Define availability schedules.
- Set or select platform-approved service rates.
- Receive customer booking requests.
- Accept or reject booking requests.
- View upcoming trips.
- Track completed trips and earnings.
- Receive customer ratings and reviews.
- View performance statistics.
- Request payouts.

Drivers will not need to own a vehicle.

They can provide driving services for vehicles owned by either rental companies or individual vehicle owners.

---

# 3. User Roles and Permissions

The platform will contain the following major user roles.

## 3.1 Customer / Renter

Customers can:

- Register and log in.
- Manage personal profiles.
- Search and filter available vehicles.
- View vehicle details.
- Select rental locations and dates.
- Choose self-drive or car-with-driver.
- Browse recommended drivers.
- Compare driver profiles and ratings.
- Select a preferred driver.
- Submit booking requests.
- Upload identity and driving license documents when required.
- Make payments.
- Manage reservations.
- Cancel or modify bookings according to policy.
- View invoices and transaction history.
- Track booking status.
- Communicate with support.
- Rate and review vehicles and drivers.

## 3.2 Rental Company

Rental companies can:

- Register their business.
- Manage company profiles.
- Submit verification documents.
- Add and manage vehicles.
- Configure rental pricing.
- Manage vehicle availability.
- Manage reservations.
- Accept or reject booking requests.
- Manage pickup and return operations.
- Track vehicle maintenance.
- View earnings and payouts.
- Access reports and analytics.

## 3.3 Individual Vehicle Owner

Vehicle owners can:

- Register and verify their accounts.
- Manage owner profiles.
- Add vehicles.
- Upload vehicle information and documents.
- Configure rental pricing.
- Manage vehicle availability.
- Receive booking requests.
- Accept or reject reservations.
- Manage active and completed rentals.
- Track revenue and payouts.
- View customer reviews.

## 3.4 Independent Driver

Drivers can:

- Register and submit verification documents.
- Manage their professional profiles.
- Upload driving licenses.
- Add experience and qualifications.
- Set service locations.
- Manage working schedules.
- Set or select approved service pricing.
- Receive booking requests.
- Accept or reject requests.
- View customer information necessary for assigned trips.
- Manage upcoming and completed trips.
- Track earnings.
- View ratings and performance.
- Request withdrawals.

## 3.5 Platform Administrator

The administrator has centralized control over the platform.

Responsibilities:

- Manage all users.
- Manage rental companies.
- Manage individual vehicle owners.
- Manage drivers.
- Verify and approve accounts.
- Verify vehicle listings and documents.
- Approve or reject driver registrations.
- Manage vehicles and categories.
- Manage bookings.
- Monitor vehicle and driver availability.
- Manage commissions and service charges.
- Manage payment transactions.
- Process refunds and disputes.
- Manage payouts.
- Manage reviews and complaints.
- Configure rental policies.
- Manage promotional campaigns.
- View financial reports.
- Monitor platform performance.
- Manage system settings and permissions.

## 3.6 Customer Support / Operations Staff

Optional dedicated staff roles:

- View customer complaints.
- Assist with booking issues.
- Handle cancellations.
- Coordinate vehicle pickup and return.
- Assist with driver-related problems.
- Record disputes.
- Escalate cases to administrators.

Permissions should be configurable through role-based access control.

---

# 4. Customer Application / Website

The customer-facing application will be the primary interface for discovering vehicles and booking rental services.

## 4.1 Homepage

The homepage should include:

- Navigation menu.
- Login and registration.
- Vehicle search section.
- Pickup location.
- Drop-off location.
- Pickup date and time.
- Return date and time.
- Vehicle categories.
- Featured vehicles.
- Popular destinations.
- Recommended vehicles.
- How the platform works.
- Promotional banners.
- Customer reviews.
- Contact information.
- Footer with policies and important links.

## 4.2 Vehicle Search

Customers should be able to search vehicles using:

- Pickup location.
- Drop-off location.
- Pickup date and time.
- Return date and time.
- Vehicle category.
- Rental type.
- Price range.

Search results should show vehicles that are available for the requested rental period.

## 4.3 Vehicle Filtering

Customers should be able to filter results by:

- Vehicle brand.
- Vehicle model.
- Vehicle category.
- Daily rental price.
- Weekly rental price.
- Monthly rental price.
- Transmission type.
- Fuel type.
- Seating capacity.
- Vehicle features.
- Rating.
- Pickup location.
- Self-drive availability.
- Car-with-driver availability.

Sorting options:

- Lowest price.
- Highest price.
- Highest rated.
- Most popular.
- Recommended.

## 4.4 Vehicle Details Page

Each vehicle should have a dedicated details page containing:

**Basic information:**
- Vehicle name.
- Brand and model.
- Manufacturing year.
- Vehicle category.
- Registration information, where appropriate.
- Seating capacity.
- Transmission.
- Fuel type.
- Mileage information.

**Vehicle images:**
- Main image.
- Image gallery.
- Interior images.
- Exterior images.

**Rental information:**
- Daily price.
- Weekly price.
- Monthly price.
- Security deposit.
- Included mileage.
- Additional mileage charges.
- Fuel policy.
- Cancellation policy.
- Pickup location.
- Drop-off options.
- Availability calendar.

**Other information:**
- Owner or rental company information.
- Vehicle rating.
- Customer reviews.
- Rental requirements.
- Insurance information.
- Available rental options.

## 4.5 Rental Type Selection

Before proceeding with checkout, customers must select one of two rental options.

### Option A: Self-Drive

Customers rent the vehicle and drive it themselves.

Requirements:

- Customer must satisfy minimum age requirements.
- Customer must provide a valid driving license.
- Customer must complete identity verification.
- Customer must agree to rental terms and conditions.
- Vehicle availability must be confirmed.
- Security deposit requirements must be displayed.
- Applicable insurance and mileage policies must be displayed.

The system should validate whether the customer is eligible for self-drive rental before confirming the reservation.

### Option B: Car with Driver

Customers rent a vehicle along with an independent professional driver.

Requirements:

- Customer selects a vehicle.
- Customer selects the car-with-driver option.
- Platform searches for available drivers.
- Platform recommends drivers based on matching criteria.
- Customer views driver profiles.
- Customer compares ratings and performance.
- Customer selects a preferred driver.
- The system validates driver availability.
- Vehicle and driver availability are confirmed together.
- Driver service charges are included in the booking calculation.

The selected driver must be assigned to the vehicle rental reservation.

The vehicle owner or rental company will only provide the vehicle. The selected driver will provide the driving service independently.

---

# 5. Independent Driver Marketplace

This is one of the most important modules of the platform.

The platform must maintain a separate marketplace for drivers.

## 5.1 Driver Registration

Drivers should be able to register independently.

Registration information:

- Full name.
- Email address.
- Phone number.
- Profile photograph.
- Date of birth.
- Residential address.
- Driving license number.
- Driving license expiry date.
- License category.
- Years of driving experience.
- Preferred service locations.
- Languages spoken.
- Professional experience.
- Emergency contact.
- Additional qualifications.

Required documents:

- National identity document.
- Driving license.
- Profile photograph.
- Address verification, if required.
- Other documents required by platform policy.

Driver registrations should remain pending until verification is completed.

## 5.2 Driver Profile

Every approved driver should have a public-facing profile.

The profile should display:

- Driver name.
- Profile photograph.
- Years of experience.
- Driving license category (not the full license number).
- Languages spoken.
- Service locations.
- Completed trips.
- Average customer rating.
- Number of reviews.
- Acceptance rate.
- Cancellation rate.
- Performance score.
- Availability status.
- Driver service pricing, where applicable.

Sensitive documents and personal information must not be publicly accessible.

## 5.3 Driver Availability Management

Drivers should manage their working schedules.

Features:

- Available / Unavailable status.
- Weekly availability.
- Custom working schedules.
- Date-specific availability.
- Vacation and leave management.
- Service area management.
- Upcoming trip calendar.
- Automatic blocking during confirmed trips.

A driver must not receive overlapping confirmed assignments.

## 5.4 Driver Recommendation Engine

When customers select car-with-driver, the platform should recommend suitable drivers.

Driver recommendations should consider:

1. Availability for the complete rental period.
2. Service location compatibility.
3. Customer ratings.
4. Completed trip history.
5. Driving experience.
6. Acceptance rate.
7. Cancellation rate.
8. Previous customer feedback.
9. Service pricing.
10. Vehicle or trip suitability.

Recommended drivers should be displayed in a ranked list.

The platform should prioritize high-performing, available, and suitable drivers.

Customers should be able to:

- View recommended drivers.
- Compare driver profiles.
- Check ratings and reviews.
- View applicable driver charges.
- Select their preferred driver.

**Important:** Recommendations are suggestions, not mandatory assignments. Customers should retain the freedom to choose from the available eligible drivers.

If the preferred driver becomes unavailable before booking confirmation, the customer should be informed and asked to select another available driver.

## 5.5 Driver Performance Management

The platform should maintain driver performance records.

Performance metrics:

- Total completed trips.
- Average rating.
- Customer satisfaction.
- Acceptance rate.
- Cancellation rate.
- Late arrival records.
- Customer complaints.
- Verified policy violations.

An administrator should be able to:

- Review driver performance.
- Suspend drivers.
- Approve or reject driver accounts.
- Investigate complaints.
- Restrict driver access.
- Reinstate suspended drivers.

Performance scores should be calculated using configurable rules rather than relying only on ratings.

---

# 6. Vehicle Marketplace and Fleet Management

The platform must support two vehicle ownership types.

1. Company-owned vehicles.
2. Individually owned vehicles.

## 6.1 Vehicle Registration

Vehicle owners and rental companies should be able to register vehicles.

Vehicle information:

- Vehicle name.
- Brand.
- Model.
- Manufacturing year.
- Registration number.
- Vehicle identification number, where required.
- Vehicle category.
- Transmission.
- Fuel type.
- Seating capacity.
- Color.
- Mileage.
- Engine capacity.
- Features and specifications.

Documents:

- Vehicle registration certificate.
- Insurance documents.
- Fitness certificate, where applicable.
- Ownership verification.
- Other legally required documents.

## 6.2 Vehicle Rental Configuration

Each vehicle should support:

- Self-drive availability.
- Car-with-driver availability.
- Daily rental rate.
- Weekly rental rate.
- Monthly rental rate.
- Security deposit.
- Additional mileage charges.
- Included mileage.
- Fuel policy.
- Minimum rental duration.
- Maximum rental duration.
- Pickup and return locations.
- Cancellation rules.

The owner or rental company should not need to register or supply a driver.

Driver availability is managed separately through the driver marketplace.

## 6.3 Vehicle Availability

Vehicle owners and rental companies should have a calendar-based availability management system.

They should be able to:

- Mark vehicles as available.
- Block vehicles for personal use.
- Block vehicles for maintenance.
- View upcoming reservations.
- View active rentals.
- Manage availability periods.

The platform must automatically block vehicles during confirmed bookings.

## 6.4 Vehicle Verification

Administrators should verify:

- Vehicle ownership.
- Registration documents.
- Insurance validity.
- Required certifications.
- Vehicle images.
- Vehicle information.

Only approved vehicles should be published on the customer marketplace.

---

# 7. Booking and Reservation Management

The booking system is the core operational component.

## 7.1 Booking Workflow

The general booking process:

1. Customer selects pickup and return locations.
2. Customer selects pickup and return dates.
3. Customer searches for vehicles.
4. System displays available vehicles.
5. Customer selects a vehicle.
6. Customer selects self-drive or car-with-driver.
7. If self-drive, customer completes license and identity verification.
8. If car-with-driver, system recommends available drivers.
9. Customer selects a preferred driver.
10. System checks vehicle and driver availability.
11. System calculates the complete rental cost.
12. Customer reviews booking details.
13. Customer accepts terms and conditions.
14. Customer proceeds with payment.
15. Booking is confirmed according to the applicable approval and payment rules.
16. Customer receives booking confirmation.

## 7.2 Booking Information

Each booking should maintain:

- Booking reference number.
- Customer ID.
- Vehicle ID.
- Vehicle owner ID.
- Rental company ID, if applicable.
- Selected rental type.
- Driver ID, if applicable.
- Pickup location.
- Drop-off location.
- Pickup date and time.
- Return date and time.
- Rental duration.
- Rental charges.
- Driver service charges.
- Additional charges.
- Taxes.
- Discounts.
- Security deposit.
- Total amount.
- Payment status.
- Booking status.
- Cancellation details.

## 7.3 Booking Approval

The platform should support configurable booking approval methods.

**Instant Booking:**
- Available vehicles can be booked immediately.
- Booking is confirmed once required payment and validation are completed.

**Owner Approval:**
- Booking request is sent to the vehicle owner or rental company.
- Provider accepts or rejects the request.
- Customer receives a notification.

For car-with-driver bookings, the driver must also accept the assignment if the selected driver uses an acceptance-based workflow.

The platform must not mark a booking fully confirmed until all required confirmations are obtained.

## 7.4 Booking Modification

Customers should be able to request:

- Pickup date changes.
- Return date changes.
- Pickup location changes.
- Drop-off location changes.
- Driver changes, where permitted.
- Rental duration changes.

Any modification must trigger new vehicle and driver availability checks and price recalculation.

## 7.5 Booking Cancellation

The platform should support cancellation by:

- Customer.
- Vehicle owner.
- Rental company.
- Driver, subject to policy.
- Administrator.

Cancellation rules must be configurable.

The system should calculate:

- Applicable cancellation fees.
- Refund amount.
- Provider compensation, if applicable.
- Driver compensation, if applicable.

Every cancellation must be recorded in the booking history.

---

# 8. Vehicle and Driver Availability Matching

This module must ensure that both vehicle and driver are available for the requested rental period.

## 8.1 Self-Drive Availability

For self-drive bookings:

- Check vehicle availability.
- Check vehicle maintenance schedule.
- Check existing reservations.
- Check pickup and return constraints.
- Validate customer eligibility.

A successful vehicle availability check is required before proceeding.

## 8.2 Car-with-Driver Availability

For car-with-driver bookings:

- Check vehicle availability.
- Check driver availability.
- Check driver service locations.
- Check driver working hours.
- Check driver qualifications.
- Check existing driver assignments.
- Check driver eligibility.

The system must find compatible vehicle-driver combinations.

## 8.3 Matching Logic

A vehicle and driver must both be available for the entire required service period.

The system should exclude:

- Vehicles with overlapping confirmed bookings.
- Vehicles undergoing maintenance.
- Suspended or unapproved vehicles.
- Drivers with overlapping confirmed trips.
- Drivers outside the service area.
- Suspended or unverified drivers.
- Drivers who do not meet the required qualifications.

The availability process must prevent double bookings.

## 8.4 Alternative Recommendations

If the selected driver becomes unavailable:

- Notify the customer.
- Display other suitable drivers.
- Allow the customer to select an alternative.
- Recalculate applicable driver charges.
- Revalidate the complete booking.

If no suitable drivers are available, the customer should be able to switch to another vehicle or self-drive, provided they satisfy self-drive eligibility requirements.

---

# 9. Pricing and Cost Calculation

The platform should support separate pricing structures for vehicles and driver services.

## 9.1 Vehicle Rental Pricing

Vehicle owners and rental companies can configure:

- Hourly rental rates, if supported.
- Daily rental rates.
- Weekly rental rates.
- Monthly rental rates.
- Seasonal pricing.
- Weekend pricing.
- Long-term rental discounts.
- Additional mileage charges.
- Delivery charges.
- Security deposits.

## 9.2 Driver Service Pricing

Drivers should be able to configure their service rates within platform-approved pricing rules.

Possible pricing models:

- Per hour.
- Per day.
- Per trip.
- Per kilometer.
- Fixed service package.
- Long-distance trip pricing.

The platform should allow different driver pricing based on the service type and duration.

## 9.3 Total Booking Calculation

For self-drive:

Total = Vehicle Rental + Additional Charges + Taxes + Applicable Fees - Discounts

For car-with-driver:

Total = Vehicle Rental + Driver Service Charges + Additional Charges + Taxes + Applicable Fees - Discounts

Security deposit should be calculated and displayed separately.

The platform must clearly distinguish refundable deposits from actual rental revenue.

## 9.4 Pricing Transparency

Before payment, customers must see:

- Vehicle rental price.
- Driver service charge, if applicable.
- Additional charges.
- Taxes.
- Platform fees, if charged to customers.
- Discount amount.
- Security deposit.
- Total amount payable.
- Refundable amount.

No undisclosed charges should be added after checkout.

---

# 10. Payment and Financial Management

## 10.1 Payment Methods

The platform should support configurable payment methods, such as:

- Debit and credit cards.
- Online payment gateways.
- Mobile financial services.
- Bank transfers.
- Cash payments, if enabled.
- Partial payments, if supported.

Payment providers should be selected based on the operating market.

## 10.2 Payment Management

Features:

- Full payment.
- Partial payment.
- Advance payment.
- Security deposit collection.
- Additional charge collection.
- Refund processing.
- Payment history.
- Transaction verification.
- Invoice generation.

## 10.3 Marketplace Commission

The platform should support separate commission configurations for:

- Vehicle rentals.
- Driver services.
- Rental companies.
- Individual vehicle owners.
- Independent drivers.

Administrators should be able to configure commission percentages or fixed fees.

## 10.4 Earnings Distribution

For a car-with-driver booking:

The platform must maintain separate financial records for:

- Vehicle rental revenue.
- Vehicle owner or rental company earnings.
- Driver service revenue.
- Driver earnings.
- Platform commission.
- Taxes.
- Payment gateway fees.
- Refunds and deductions.

The vehicle provider and driver must receive separate earnings records.

## 10.5 Payout Management

Providers should be able to:

- View total earnings.
- View pending earnings.
- View completed payouts.
- View deductions.
- Request withdrawals, if enabled.
- View payout history.

Administrators should be able to approve, reject, and process payouts.

---

# 11. Vehicle Pickup and Return Management

## 11.1 Pickup Management

Before handing over the vehicle, authorized staff or the owner should record:

- Booking reference.
- Customer information.
- Driver information, if applicable.
- Vehicle condition.
- Existing scratches or damage.
- Starting mileage.
- Fuel level or battery level.
- Pickup date and time.
- Vehicle photographs.
- Customer acknowledgment.

The system should generate a digital vehicle handover report.

## 11.2 Return Management

Upon vehicle return:

- Record actual return date and time.
- Record ending mileage.
- Record fuel or battery level.
- Inspect vehicle condition.
- Upload return photographs.
- Record additional damage.
- Calculate late-return charges.
- Calculate additional mileage charges.
- Record any additional expenses.

The platform should generate a final rental statement.

## 11.3 Driver Trip Completion

For car-with-driver bookings:

The driver should be able to:

- View assigned trips.
- Confirm arrival.
- Start the trip.
- Mark the trip as completed.
- Report trip-related issues.
- Submit relevant trip records.

The system should record timestamps for operational tracking.

---

# 12. Ratings, Reviews and Performance

## 12.1 Vehicle Reviews

Customers should be able to rate vehicles based on:

- Vehicle condition.
- Cleanliness.
- Accuracy of listing.
- Overall rental experience.

## 12.2 Driver Reviews

Customers should be able to rate drivers based on:

- Driving behavior.
- Professionalism.
- Punctuality.
- Communication.
- Safety.
- Overall service quality.

## 12.3 Owner and Company Reviews

Customers should also be able to rate the vehicle provider based on:

- Communication.
- Vehicle handover.
- Service quality.
- Overall experience.

## 12.4 Review Management

Requirements:

- Only eligible customers can submit reviews.
- Reviews must be linked to completed bookings.
- Duplicate reviews should be prevented.
- Administrators can moderate inappropriate content.
- Providers can report abusive reviews.
- Rating calculations should be automatic.

---

# 13. Notifications and Communication

The platform should provide automated notifications.

## 13.1 Customer Notifications

- Registration confirmation.
- Verification status.
- Booking request submitted.
- Booking confirmed.
- Booking rejected.
- Payment confirmation.
- Upcoming pickup reminder.
- Return reminder.
- Booking modification.
- Booking cancellation.
- Refund status.
- Driver assignment.
- Driver arrival notification.
- Review request.

## 13.2 Vehicle Provider Notifications

- New booking request.
- Booking accepted.
- Booking rejected.
- Booking cancellation.
- Upcoming vehicle pickup.
- Vehicle return.
- Payment received.
- Payout status.
- Customer complaints.

## 13.3 Driver Notifications

- New trip request.
- Booking assignment.
- Booking cancellation.
- Trip reminder.
- Customer details for assigned trips.
- Upcoming pickup.
- Payment and earnings updates.
- Rating and review notifications.

## 13.4 Notification Channels

- In-app notifications.
- Email.
- SMS.
- Push notifications.
- Optional messaging integration.

---

# 14. Admin Dashboard

The administration dashboard should provide centralized platform management.

## 14.1 Dashboard Overview

Display:

- Total customers.
- Total rental companies.
- Total individual vehicle owners.
- Total registered drivers.
- Total approved vehicles.
- Total active vehicles.
- Available vehicles.
- Total bookings.
- Pending bookings.
- Active rentals.
- Completed rentals.
- Cancelled bookings.
- Total revenue.
- Platform commissions.
- Pending payouts.
- Driver performance overview.

## 14.2 User Management

Administrators should manage:

- Customers.
- Rental companies.
- Vehicle owners.
- Drivers.
- Support staff.

Actions:

- View profiles.
- Verify accounts.
- Approve registrations.
- Reject registrations.
- Suspend accounts.
- Reactivate accounts.
- View account activity.

## 14.3 Vehicle Management

Administrators should:

- View all registered vehicles.
- Approve or reject vehicle listings.
- Review vehicle documents.
- Manage categories.
- Update vehicle status.
- Remove inappropriate listings.
- Monitor maintenance status.

## 14.4 Driver Management

Administrators should:

- Review driver registrations.
- Verify driving licenses.
- Approve or reject applications.
- View driver performance.
- Monitor ratings.
- Review complaints.
- Suspend or reinstate drivers.
- Manage service areas.
- Manage pricing policies.

## 14.5 Booking Management

Administrators should:

- View all reservations.
- Filter by rental type.
- Filter by vehicle provider.
- Filter by driver.
- Filter by date.
- Review booking details.
- Modify bookings when authorized.
- Cancel bookings.
- Resolve disputes.
- Monitor active rentals.

## 14.6 Financial Dashboard

Administrators should view:

- Gross rental revenue.
- Vehicle provider earnings.
- Driver earnings.
- Platform commission.
- Taxes and fees.
- Refunds.
- Payment gateway transactions.
- Pending payouts.
- Completed payouts.
- Financial reports.

## 14.7 System Configuration

Administrators should configure:

- Platform commission.
- Driver service commission.
- Booking policies.
- Cancellation policies.
- Security deposit rules.
- Taxes.
- Supported payment methods.
- Vehicle categories.
- Driver categories.
- Supported locations.
- Minimum rental duration.
- Maximum rental duration.
- Customer verification requirements.
- Driver verification requirements.

---

# 15. Additional Operational Features

## 15.1 Maintenance Management

Vehicle providers should manage:

- Maintenance schedules.
- Service history.
- Repair records.
- Maintenance costs.
- Vehicle availability during maintenance.
- Upcoming maintenance reminders.

## 15.2 Dispute Management

The system should support disputes involving:

- Vehicle damage.
- Security deposit deductions.
- Payment problems.
- Late returns.
- Driver behavior.
- Booking cancellations.
- Service quality.
- Refund disagreements.

Administrators should be able to review evidence, communication history, and booking records before making decisions.

## 15.3 Emergency Support

For car-with-driver bookings, customers and drivers should have access to:

- Emergency contact information.
- Support contact.
- Report an incident.
- Report a safety concern.
- Submit trip-related complaints.

## 15.4 GPS and Trip Tracking

This can be introduced as an advanced feature.

Possible capabilities:

- Driver live location.
- Trip tracking.
- Pickup location monitoring.
- Estimated arrival time.
- Trip history.

GPS tracking should be enabled only with appropriate consent and permissions.

---

# 16. Suggested Database Architecture

The database should support multiple vehicle providers, independent drivers, two rental modes, financial separation, and booking availability.

Suggested entities:

## 16.1 Authentication and Users

- users
- roles
- permissions
- user_roles
- customer_profiles
- provider_profiles
- driver_profiles
- user_documents
- verification_records

## 16.2 Vehicle Marketplace

- vehicles
- vehicle_images
- vehicle_documents
- vehicle_categories
- vehicle_features
- vehicle_feature_mappings
- vehicle_availability
- vehicle_maintenance
- vehicle_locations

## 16.3 Rental Providers

- rental_companies
- vehicle_owners
- provider_locations
- provider_payout_accounts

## 16.4 Driver Marketplace

- drivers
- driver_documents
- driver_licenses
- driver_service_areas
- driver_availability
- driver_pricing
- driver_performance
- driver_payout_accounts

## 16.5 Booking System

- bookings
- booking_vehicles
- booking_drivers
- booking_status_history
- booking_modifications
- booking_cancellations
- booking_pickups
- booking_returns
- vehicle_inspections
- trip_records

## 16.6 Financial Management

- pricing_rules
- booking_price_breakdowns
- payments
- payment_transactions
- security_deposits
- refunds
- commissions
- provider_earnings
- driver_earnings
- payouts
- payout_transactions
- invoices

## 16.7 Communication and Reviews

- notifications
- messages
- reviews
- ratings
- complaints
- disputes
- support_tickets

## 16.8 Platform Configuration

- platform_settings
- commission_settings
- cancellation_policies
- rental_terms
- locations
- taxes
- payment_methods
- audit_logs

The final database design should be normalized where appropriate, with clear relationships and transaction boundaries.

---

# 17. Core Business Rules

The following rules must be enforced throughout the platform.

**BR-01: Multiple Vehicle Providers**

The platform must support company-owned and individually owned vehicles.

**BR-02: Independent Driver Marketplace**

Drivers must register and operate independently of rental companies and vehicle owners.

**BR-03: Two Rental Types**

Every booking must specify either self-drive or car-with-driver.

**BR-04: No Company-Provided Drivers**

Rental companies and vehicle owners are not required to supply drivers.

**BR-05: Driver Selection**

For car-with-driver bookings, customers must be able to select an eligible driver from the platform's recommended drivers.

**BR-06: Driver Recommendations**

Driver recommendations must consider availability, ratings, performance, experience, and service locations.

**BR-07: Vehicle Availability**

A vehicle cannot have overlapping confirmed reservations.

**BR-08: Driver Availability**

A driver cannot have overlapping confirmed trip assignments.

**BR-09: Combined Availability**

A car-with-driver booking cannot be confirmed unless both the vehicle and selected driver are available.

**BR-10: Customer Eligibility**

Self-drive bookings require appropriate customer identity and driving license verification.

**BR-11: Independent Financial Records**

Vehicle rental earnings and driver service earnings must be maintained separately.

**BR-12: Commission Management**

Administrators must be able to configure separate commissions for vehicle rentals and driver services.

**BR-13: Verification**

Unverified providers, vehicles, and drivers must not be publicly available for bookings.

**BR-14: Booking Audit**

Every important booking status change must be recorded.

**BR-15: Refund Transparency**

Refunds, deposits, deductions, and commissions must be separately tracked.

**BR-16: Cancellation Policy**

Cancellation fees and provider/driver compensation must follow configurable policies.

**BR-17: No Double Booking**

Availability checks and booking creation must be protected against concurrent requests.

**BR-18: Driver Replacement**

If a driver becomes unavailable, the platform must allow an eligible replacement driver to be selected without losing the vehicle reservation, subject to revalidation.

---

# 18. Non-Functional Requirements

## 18.1 Security

- Secure authentication.
- Password hashing.
- Role-based access control.
- Secure document storage.
- API authorization.
- Protection against common web vulnerabilities.
- Payment security.
- Sensitive information protection.
- Audit logging.

## 18.2 Performance

- Fast vehicle search.
- Efficient availability queries.
- Optimized database queries.
- Pagination for large datasets.
- Image optimization.
- Background processing for notifications.
- Scalable architecture.

## 18.3 Reliability

- Transaction-safe booking operations.
- Prevention of double bookings.
- Reliable payment verification.
- Booking recovery mechanisms.
- Error logging.
- Backup and recovery procedures.

## 18.4 Scalability

The architecture should support:

- Increasing vehicle inventory.
- Multiple rental companies.
- Thousands of individual owners.
- Large numbers of drivers.
- Multiple service locations.
- Increasing booking volumes.

## 18.5 Usability

- Responsive web interface.
- Mobile-friendly design.
- Simple booking workflow.
- Clear pricing information.
- Accessible user interfaces.
- Easy dashboard navigation.

## 18.6 Privacy

- Protect customer information.
- Restrict access to identity documents.
- Restrict access to driving licenses.
- Share driver/customer information only when necessary for an assigned booking.
- Follow applicable privacy and data protection requirements.

---

# 19. Recommended Technology Architecture

The technology stack can be finalized based on the development team's preferences.

A possible architecture:

**Frontend**
- Next.js / React.
- TypeScript.
- Tailwind CSS.
- Responsive UI.

**Backend**
- Node.js.
- Express.js or NestJS.
- REST API.

**Database**
- PostgreSQL.
- Prisma ORM.

**Authentication**
- JWT-based authentication.
- Refresh token management.
- Role-based permissions.

**File Storage**
- Cloud object storage for vehicle images and verification documents.

**Payment**
- Payment gateway integration based on the target country.

**Notifications**
- Email service.
- SMS provider.
- Push notifications.

**Maps and Locations**
- Google Maps or another supported mapping provider.
- Geocoding and distance calculation.

**Infrastructure**
- Cloud hosting.
- Database backups.
- Error monitoring.
- Logging and analytics.

---

# 20. Development Phases

The platform should be developed incrementally.

## Phase 1: Foundation

- Authentication.
- Role management.
- Customer profiles.
- Rental company registration.
- Individual owner registration.
- Driver registration.
- Verification workflows.

## Phase 2: Vehicle Marketplace

- Vehicle management.
- Vehicle listing.
- Vehicle categories.
- Vehicle image and document uploads.
- Vehicle pricing.
- Vehicle availability.
- Search and filtering.

## Phase 3: Driver Marketplace

- Driver profiles.
- Driver verification.
- Driver availability.
- Driver pricing.
- Driver service areas.
- Driver recommendation engine.
- Driver selection.

## Phase 4: Booking Engine

- Self-drive bookings.
- Car-with-driver bookings.
- Vehicle availability validation.
- Driver availability validation.
- Combined vehicle-driver matching.
- Booking approval.
- Booking modification.
- Booking cancellation.

## Phase 5: Payments and Finance

- Payment gateway.
- Security deposits.
- Pricing calculations.
- Platform commissions.
- Provider earnings.
- Driver earnings.
- Refunds.
- Payouts.
- Invoices.

## Phase 6: Rental Operations

- Vehicle pickup.
- Vehicle return.
- Vehicle inspection.
- Driver trip management.
- Maintenance management.
- Dispute management.

## Phase 7: Admin Dashboard and Reporting

- Platform overview.
- User management.
- Vehicle management.
- Driver management.
- Booking management.
- Financial reports.
- Performance analytics.

## Phase 8: Advanced Features

- GPS tracking.
- Live driver location.
- Advanced recommendation algorithms.
- Promotional campaigns.
- Loyalty programs.
- Mobile applications.
- Advanced analytics.

---

# 21. Minimum Viable Product (MVP)

The first production-ready release should focus on the essential rental and marketplace operations.

The MVP should include:

### Customer

- Registration and login.
- Vehicle search.
- Vehicle details.
- Self-drive selection.
- Car-with-driver selection.
- Driver recommendations.
- Driver selection.
- Booking creation.
- Payment.
- Booking history.
- Cancellation.

### Vehicle Providers

- Company and individual owner registration.
- Verification.
- Vehicle listing.
- Pricing management.
- Availability management.
- Booking approval.
- Booking history.
- Earnings overview.

### Drivers

- Driver registration.
- Document verification.
- Driver profiles.
- Availability management.
- Driver pricing.
- Booking requests.
- Trip management.
- Earnings overview.
- Ratings and reviews.

### Administrator

- Dashboard.
- User verification.
- Provider management.
- Vehicle approval.
- Driver approval.
- Booking management.
- Payment monitoring.
- Commission configuration.
- Basic reporting.

Advanced GPS tracking, complex loyalty programs, and advanced predictive analytics can be introduced in later releases.

---

# 22. Important Decisions to Finalize Before Development

The following business decisions must be finalized to avoid architectural changes during implementation.

1. **Operating Geography:** Which country, cities, and locations will the platform initially support?

2. **Rental Duration:** Will rentals be hourly, daily, weekly, monthly, or all of these?

3. **Driver Pricing:** Will drivers set their own prices, or will the platform define standard rates?

4. **Driver Assignment:** Will the driver need to accept every booking, or can the platform automatically assign a previously selected driver?

5. **Owner Approval:** Will all vehicle bookings require owner approval, or will instant booking be supported?

6. **Driver Replacement:** If a driver cancels after booking confirmation, will the platform automatically recommend another driver or ask the customer to choose?

7. **Payment Collection:** Will customers pay the full rental amount upfront, pay a deposit, or pay partially?

8. **Security Deposit:** Will the security deposit be mandatory for every rental, or configurable by vehicle and rental type?

9. **Driver Compensation:** Will drivers receive payment directly from the platform, or will customers pay drivers separately?

10. **Commission Structure:** Will the platform charge separate commissions for vehicle rentals and driver services?

11. **Insurance:** Who will be responsible for vehicle insurance and driver-related coverage?

12. **Vehicle Delivery:** Will vehicles be picked up from provider locations, or can customers request delivery?

13. **Driver Service Scope:** Will drivers provide only driving services, or will they also be available for hourly, daily, airport transfer, and long-distance services?

14. **Rental Eligibility:** What age, license, and identity verification requirements will apply to self-drive customers?

15. **Geographical Expansion:** Will the platform support multiple currencies, languages, and countries from the beginning?

---

# 23. Expected Final System

The completed platform will function as a centralized hybrid vehicle rental marketplace with three independent supply components:

**1. Vehicle Supply**
- Traditional rental companies.
- Individual vehicle owners.

**2. Driver Supply**
- Independent professional drivers registered on the platform.

**3. Customer Demand**
- Customers looking for self-drive rentals.
- Customers looking for vehicles with professional drivers.

The platform will connect these components through an integrated search, availability, recommendation, booking, payment, and operational management system.

The key differentiator is that customers can rent a vehicle from either a company or an individual owner and independently choose a professional driver from the platform when they require a driver.

This creates a flexible rental ecosystem where vehicle ownership and driving services remain separate, while the platform manages the entire customer experience.

---

**End of Document**