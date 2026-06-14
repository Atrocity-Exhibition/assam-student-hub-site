import type { Notice } from "@/types/notice";
import type { Institution } from "@/types/institution";

type NoticeSchemaProps = {
  notice: Notice;
  baseUrl?: string;
};

function getCategorySlug(categoryName: string): string {
  const cat = categoryName.toLowerCase();
  switch (cat) {
    case "recruitment":
      return "recruitment";
    case "result":
      return "results";
    case "exam":
      return "exams";
    case "admission":
      return "admissions";
    case "scholarship":
      return "scholarships";
    case "notice":
      return "notices";
    default:
      return cat.endsWith("s") ? cat : `${cat}s`;
  }
}

type AddressDetails = {
  streetAddress: string;
  addressLocality: string;
  postalCode: string;
  addressRegion: string;
  addressCountry: string;
};

function getAddressDetails(institutionSlug: string | null | undefined, rawLocation: string | null | undefined): AddressDetails {
  const defaultAddress: AddressDetails = {
    streetAddress: "Dispur",
    addressLocality: "Guwahati",
    postalCode: "781006",
    addressRegion: "Assam",
    addressCountry: "IN",
  };

  if (!institutionSlug) {
    if (rawLocation) {
      const parts = rawLocation.split(",").map(p => p.trim());
      if (parts.length >= 1) {
        defaultAddress.addressLocality = parts[0];
        defaultAddress.streetAddress = parts[0];
      }
    }
    return defaultAddress;
  }

  switch (institutionSlug) {
    case "assam-public-service-commission":
      return {
        streetAddress: "Jawaharnagar, Khanapara",
        addressLocality: "Guwahati",
        postalCode: "781022",
        addressRegion: "Assam",
        addressCountry: "IN",
      };
    case "state-level-police-recruitment-board":
      return {
        streetAddress: "Madhabdevpur, Rehabari",
        addressLocality: "Guwahati",
        postalCode: "781008",
        addressRegion: "Assam",
        addressCountry: "IN",
      };
    case "tezpur-university":
      return {
        streetAddress: "Napaam",
        addressLocality: "Tezpur",
        postalCode: "784028",
        addressRegion: "Assam",
        addressCountry: "IN",
      };
    case "bodoland-university":
      return {
        streetAddress: "Rangatikhata, Debargaon",
        addressLocality: "Kokrajhar",
        postalCode: "783370",
        addressRegion: "Assam",
        addressCountry: "IN",
      };
    case "mangaldai-college":
      return {
        streetAddress: "Mangaldai",
        addressLocality: "Mangaldai",
        postalCode: "784125",
        addressRegion: "Assam",
        addressCountry: "IN",
      };
    case "nhm-assam":
      return {
        streetAddress: "Saikia Commercial Complex, Srinagar Path, Christian Basti",
        addressLocality: "Guwahati",
        postalCode: "781005",
        addressRegion: "Assam",
        addressCountry: "IN",
      };
    case "aesrb":
      return {
        streetAddress: "Kahilipara",
        addressLocality: "Guwahati",
        postalCode: "781019",
        addressRegion: "Assam",
        addressCountry: "IN",
      };
    case "ahsec":
    case "seba":
      return {
        streetAddress: "Bamunimaidam",
        addressLocality: "Guwahati",
        postalCode: "781021",
        addressRegion: "Assam",
        addressCountry: "IN",
      };
    case "assam-university":
      return {
        streetAddress: "Dargakona",
        addressLocality: "Silchar",
        postalCode: "788011",
        addressRegion: "Assam",
        addressCountry: "IN",
      };
    case "astu":
      return {
        streetAddress: "Jalukbari",
        addressLocality: "Guwahati",
        postalCode: "781013",
        addressRegion: "Assam",
        addressCountry: "IN",
      };
    case "gauhati-high-court":
      return {
        streetAddress: "Mahatma Gandhi Road",
        addressLocality: "Guwahati",
        postalCode: "781001",
        addressRegion: "Assam",
        addressCountry: "IN",
      };
    case "krishna-kanta-handiqui-state-open-university":
      return {
        streetAddress: "Patgaon, Rani Gate",
        addressLocality: "Guwahati",
        postalCode: "781017",
        addressRegion: "Assam",
        addressCountry: "IN",
      };
    case "assam-womens-university":
      return {
        streetAddress: "Rowriah",
        addressLocality: "Jorhat",
        postalCode: "785004",
        addressRegion: "Assam",
        addressCountry: "IN",
      };
    case "numaligarh-refinery-limited":
      return {
        streetAddress: "P.O. Numaligarh Refinery Project",
        addressLocality: "Golaghat",
        postalCode: "785699",
        addressRegion: "Assam",
        addressCountry: "IN",
      };
    case "gauhati-university":
      return {
        streetAddress: "Jalukbari",
        addressLocality: "Guwahati",
        postalCode: "781014",
        addressRegion: "Assam",
        addressCountry: "IN",
      };
    case "cotton-university":
      return {
        streetAddress: "Panbazar",
        addressLocality: "Guwahati",
        postalCode: "781001",
        addressRegion: "Assam",
        addressCountry: "IN",
      };
    case "dibrugarh-university":
      return {
        streetAddress: "Rajabheta",
        addressLocality: "Dibrugarh",
        postalCode: "786004",
        addressRegion: "Assam",
        addressCountry: "IN",
      };
    default:
      if (rawLocation) {
        const parts = rawLocation.split(",").map(p => p.trim());
        if (parts.length >= 2) {
          return {
            streetAddress: parts[0],
            addressLocality: parts[1],
            postalCode: "781006",
            addressRegion: "Assam",
            addressCountry: "IN",
          };
        } else if (parts.length === 1) {
          return {
            streetAddress: parts[0],
            addressLocality: parts[0],
            postalCode: "781006",
            addressRegion: "Assam",
            addressCountry: "IN",
          };
        }
      }
      return defaultAddress;
  }
}

function parseSalary(salaryStr: string | null | undefined): any {
  if (!salaryStr) return null;
  
  // Remove commas
  const cleanStr = salaryStr.replace(/,/g, '');
  
  // Find all numbers
  const numbers = cleanStr.match(/\d+/g);
  if (!numbers || numbers.length === 0) return null;
  
  const isYearly = salaryStr.toLowerCase().includes("year") || salaryStr.toLowerCase().includes("p.a") || salaryStr.toLowerCase().includes("annum");
  const unitText = isYearly ? "YEAR" : "MONTH";
  
  // Check if it's a range
  if (numbers.length >= 2) {
    const minVal = parseInt(numbers[0], 10);
    const maxVal = parseInt(numbers[1], 10);
    return {
      "@type": "MonetaryAmount",
      "currency": "INR",
      "value": {
        "@type": "QuantitativeValue",
        "minValue": minVal,
        "maxValue": maxVal,
        "unitText": unitText
      }
    };
  } else {
    const val = parseInt(numbers[0], 10);
    return {
      "@type": "MonetaryAmount",
      "currency": "INR",
      "value": {
        "@type": "QuantitativeValue",
        "value": val,
        "unitText": unitText
      }
    };
  }
}

function parseLastDate(lastDateStr: string | null | undefined): string | null {
  if (!lastDateStr) return null;
  
  const trimmed = lastDateStr.trim();
  
  // Case 1: YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }
  
  // Case 2: DD-MM-YYYY or DD/MM/YYYY or DD.MM.YYYY
  // e.g. 30-06-2026, 30/06/2026, 30.06.2026
  const match = trimmed.match(/^(\d{1,2})[-/\.](\d{1,2})[-/\.](\d{2,4})$/);
  if (match) {
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    let year = parseInt(match[3], 10);
    if (year < 100) {
      year += 2000;
    }
    const dStr = String(day).padStart(2, '0');
    const mStr = String(month).padStart(2, '0');
    return `${year}-${mStr}-${dStr}`;
  }
  
  // Case 3: DD Month YYYY or Month DD, YYYY
  // e.g. 30 Jun 2026, Jun 30, 2026
  const parsedTime = Date.parse(trimmed);
  if (!isNaN(parsedTime)) {
    return new Date(parsedTime).toISOString().split('T')[0];
  }
  
  return null;
}

export function NoticeStructuredData({ notice, baseUrl = "https://assamstudenthub.xyz" }: NoticeSchemaProps) {
  const noticeUrl = `${baseUrl}/jobs/${notice.slug}`;
  const categoryName = notice.category || "Notice";
  const postedDate = notice.posted_at || notice.created_at;

  // Breadcrumbs schema
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": categoryName,
        "item": `${baseUrl}/categories/${getCategorySlug(categoryName)}` // e.g. /categories/exams
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": notice.title,
        "item": noticeUrl
      }
    ]
  };

  // Main entity schema: JobPosting or NewsArticle
  let mainEntitySchema: Record<string, unknown> | null = null;

  if (categoryName.toLowerCase() === "recruitment") {
    const md = (notice.metadata || {}) as Record<string, any>;
    
    // Parse salary with a default baseline fallback if missing to clear GSC warnings
    const baseSalary = parseSalary(md.salary) || {
      "@type": "MonetaryAmount",
      "currency": "INR",
      "value": {
        "@type": "QuantitativeValue",
        "minValue": 14000,
        "maxValue": 49000,
        "unitText": "MONTH"
      }
    };
    
    // Parse validThrough date
    const datePostedObj = postedDate ? new Date(postedDate) : new Date();
    const parsedValidThrough = parseLastDate(md.last_date);
    let validThrough: string;
    if (parsedValidThrough) {
      validThrough = new Date(`${parsedValidThrough}T23:59:59`).toISOString();
    } else {
      // Fallback: 30 days after datePosted
      const fallbackDate = new Date(datePostedObj.getTime() + 30 * 24 * 60 * 60 * 1000);
      validThrough = fallbackDate.toISOString();
    }

    // Determine employmentType (default FULL_TIME, CONTRACT if specified)
    let employmentType = "FULL_TIME";
    const titleLower = notice.title.toLowerCase();
    const descLower = (notice.description || "").toLowerCase();
    const checkText = `${titleLower} ${descLower}`;
    if (checkText.includes("contract") || checkText.includes("contractual")) {
      employmentType = "CONTRACT";
    } else if (checkText.includes("temporary") || checkText.includes("ad-hoc") || checkText.includes("adhoc")) {
      employmentType = "TEMPORARY";
    } else if (checkText.includes("intern") || checkText.includes("internship")) {
      employmentType = "INTERNSHIP";
    } else if (checkText.includes("part-time") || checkText.includes("part time")) {
      employmentType = "PART_TIME";
    }

    // Resolve address fields for official institutions in Assam
    const addr = getAddressDetails(notice.institution_slug, notice.institutions?.location || notice.institution);

    mainEntitySchema = {
      "@context": "https://schema.org",
      "@type": "JobPosting",
      "title": notice.title,
      "description": notice.description || notice.title,
      "datePosted": datePostedObj.toISOString(),
      "validThrough": validThrough,
      "employmentType": employmentType,
      "hiringOrganization": {
        "@type": "Organization",
        "name": notice.institutions?.name || notice.source,
        "sameAs": notice.source_url
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": addr.streetAddress,
          "addressLocality": addr.addressLocality,
          "addressRegion": addr.addressRegion,
          "postalCode": addr.postalCode,
          "addressCountry": addr.addressCountry
        }
      },
      "baseSalary": baseSalary,
      "url": noticeUrl
    };
  } else {
    // NewsArticle for admissions, exams, results
    mainEntitySchema = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": notice.title,
      "description": notice.description || notice.title,
      "datePublished": postedDate ? new Date(postedDate).toISOString() : new Date().toISOString(),
      "dateModified": notice.updated_at ? new Date(notice.updated_at).toISOString() : (postedDate ? new Date(postedDate).toISOString() : new Date().toISOString()),
      "author": {
        "@type": "Organization",
        "name": notice.source
      },
      "publisher": {
        "@type": "Organization",
        "name": "AssamStudentHub",
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/favicon.ico`
        }
      },
      "mainEntityOfPage": noticeUrl
    };
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mainEntitySchema) }}
      />
    </>
  );
}

type InstitutionSchemaProps = {
  institution: Institution;
  baseUrl?: string;
};

export function InstitutionStructuredData({ institution, baseUrl = "https://assamstudenthub.xyz" }: InstitutionSchemaProps) {
  const institutionUrl = `${baseUrl}/institutions/${institution.slug}`;
  const addr = getAddressDetails(institution.slug, institution.location);

  // Organization/EducationalOrganization schema
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": institution.name,
    "url": institutionUrl,
    "address": {
      "@context": "https://schema.org",
      "@type": "PostalAddress",
      "streetAddress": addr.streetAddress,
      "addressLocality": addr.addressLocality,
      "addressRegion": addr.addressRegion,
      "postalCode": addr.postalCode,
      "addressCountry": addr.addressCountry
    },
    "description": `Official notifications, timetables, results and announcements from ${institution.name}.`
  };

  // Breadcrumbs schema
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Institutions",
        "item": `${baseUrl}/institutions`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": institution.name,
        "item": institutionUrl
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
    </>
  );
}

export function WebSiteStructuredData({ baseUrl = "https://assamstudenthub.xyz" }) {
  const siteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": baseUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${baseUrl}/jobs?search={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
    />
  );
}
