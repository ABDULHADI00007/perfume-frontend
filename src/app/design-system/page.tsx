"use client";

import React, { useState } from "react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Radio } from "@/components/ui/radio";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Modal } from "@/components/ui/modal";
import { Drawer } from "@/components/ui/drawer";
import { Dropdown } from "@/components/ui/dropdown";
import { Pagination } from "@/components/ui/pagination";
import { Divider } from "@/components/ui/divider";
import { Icons } from "@/components/ui/icons";
import { ProductCard } from "@/features/products/components/ProductCard";
import { Product } from "@/features/products/types";
import { DataTable } from "@/components/admin/DataTable";
import { StatsCard } from "@/components/admin/StatsCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

// Sample fixture data purely for testing the design system showcase
const sampleProduct: Product = {
  id: "prod-1",
  title: "Santal Impérial",
  slug: "santal-imperial",
  shortDescription: "A magnetic blend of Mysore sandalwood, cardamom, and smoked amber.",
  description: "Detailed description of the fragrance...",
  concentration: "Extrait de Parfum",
  olfactoryFamily: "Woody Oriental",
  notes: {
    top: ["Cardamom", "Bergamot"],
    heart: ["Iris", "Papyrus"],
    base: ["Sandalwood", "Amber", "Cedarwood"],
  },
  variants: [
    { id: "v-1", size: "50ml", price: 240, stock: 12, sku: "SI-50" },
    { id: "v-2", size: "100ml", price: 360, compareAtPrice: 400, stock: 4, sku: "SI-100" },
  ],
  images: [
    "/images/perfumes/perfume-1.jpg",
    "/images/perfumes/perfume-2.jpg",
  ],
  featured: true,
  isLimitedEdition: true,
  categoryId: "cat-woody",
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
};

interface SampleAdminRow {
  id: string;
  orderNumber: string;
  customer: string;
  total: string;
  status: string;
  date: string;
}

const sampleAdminData: SampleAdminRow[] = [
  { id: "1", orderNumber: "#ORD-9482", customer: "Eleanor Vance", total: "$360.00", status: "processing", date: "2026-09-14" },
  { id: "2", orderNumber: "#ORD-9481", customer: "Julian Mercer", total: "$720.00", status: "delivered", date: "2026-09-13" },
  { id: "3", orderNumber: "#ORD-9480", customer: "Claire Beaumont", total: "$240.00", status: "pending", date: "2026-09-13" },
];

export default function DesignSystemPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [checkboxVal, setCheckboxVal] = useState(true);
  const [radioVal, setRadioVal] = useState("option1");
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <Container size="default">
        {/* Header Banner */}
        <header className="mb-16 border-b border-border pb-8">
          <p className="text-caption text-foreground-muted mb-2">Design Foundation</p>
          <h1 className="text-h1 font-serif text-foreground">Luxury Design System</h1>
          <p className="text-body-sm text-foreground-muted mt-2 max-w-2xl">
            Maison de Parfum design tokens, typography scale, responsive primitives, product card foundation, and administrative UI components.
          </p>
        </header>

        {/* 1. Color Palette Tokens */}
        <section className="mb-16">
          <h2 className="text-h2 font-serif mb-6">Color System & Tokens</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            <div className="p-4 border border-border bg-background">
              <div className="h-10 border border-border mb-2 bg-background" />
              <p className="text-xs font-semibold">Background</p>
              <p className="text-[10px] text-foreground-muted">#FBF9F5</p>
            </div>
            <div className="p-4 border border-border bg-surface">
              <div className="h-10 border border-border mb-2 bg-surface" />
              <p className="text-xs font-semibold">Surface</p>
              <p className="text-[10px] text-foreground-muted">#FFFFFF</p>
            </div>
            <div className="p-4 border border-border bg-surface-subtle">
              <div className="h-10 border border-border mb-2 bg-surface-subtle" />
              <p className="text-xs font-semibold">Surface Subtle</p>
              <p className="text-[10px] text-foreground-muted">#F5EFE6</p>
            </div>
            <div className="p-4 border border-border bg-primary text-primary-foreground">
              <div className="h-10 mb-2 bg-primary" />
              <p className="text-xs font-semibold">Primary Charcoal</p>
              <p className="text-[10px] opacity-70">#121212</p>
            </div>
            <div className="p-4 border border-border bg-accent text-accent-foreground">
              <div className="h-10 mb-2 bg-accent" />
              <p className="text-xs font-semibold">Accent Gold</p>
              <p className="text-[10px] opacity-70">#C5A880</p>
            </div>
            <div className="p-4 border border-border bg-surface">
              <div className="h-10 border border-border mb-2 bg-border" />
              <p className="text-xs font-semibold">Border Neutral</p>
              <p className="text-[10px] text-foreground-muted">#E5DFD5</p>
            </div>
          </div>
        </section>

        <Divider variant="with-diamond" />

        {/* 2. Typography Scale */}
        <section className="mb-16">
          <h2 className="text-h2 font-serif mb-6">Typography Hierarchy</h2>
          <div className="space-y-6 border border-border p-6 sm:p-8 bg-surface">
            <div>
              <p className="text-caption text-foreground-subtle mb-1">Display Serif</p>
              <p className="text-display">L&apos;Élixir Sublime</p>
            </div>
            <div>
              <p className="text-caption text-foreground-subtle mb-1">Heading 1 Serif</p>
              <h1 className="text-h1">Artisanal Haute Parfumerie</h1>
            </div>
            <div>
              <p className="text-caption text-foreground-subtle mb-1">Heading 2 Serif</p>
              <h2 className="text-h2">The Private Reserve Collection</h2>
            </div>
            <div>
              <p className="text-caption text-foreground-subtle mb-1">Heading 3 Serif</p>
              <h3 className="text-h3">Craftsmanship & Olfactory Heritage</h3>
            </div>
            <div>
              <p className="text-caption text-foreground-subtle mb-1">Heading 4 Sans (Uppercase Tracked)</p>
              <h4 className="text-h4">Olfactory Notes & Formulation</h4>
            </div>
            <div>
              <p className="text-caption text-foreground-subtle mb-1">Body Regular</p>
              <p className="text-body max-w-2xl">
                Every fragrance is formulated in Grasse with hand-selected rare botanicals, aged natural resins, and ethically sourced essences to evoke timeless sophistication.
              </p>
            </div>
            <div>
              <p className="text-caption text-foreground-subtle mb-1">Body Small</p>
              <p className="text-body-sm max-w-xl">
                Standard delivery is complimentary on all orders exceeding $200. Orders arrive in signature embossed presentation boxes.
              </p>
            </div>
          </div>
        </section>

        <Divider variant="with-diamond" />

        {/* 3. Button System */}
        <section className="mb-16">
          <h2 className="text-h2 font-serif mb-6">Button System & States</h2>
          <div className="space-y-6 border border-border p-6 sm:p-8 bg-surface">
            <div>
              <p className="text-caption text-foreground-subtle mb-3">Variants</p>
              <div className="flex flex-wrap gap-4 items-center">
                <Button variant="primary">Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="outline">Outline Button</Button>
                <Button variant="accent">Accent Gold</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="link">Underlined Link</Button>
                <Button variant="danger">Danger Action</Button>
              </div>
            </div>

            <div>
              <p className="text-caption text-foreground-subtle mb-3">Sizes & Icons</p>
              <div className="flex flex-wrap gap-4 items-center">
                <Button size="sm" leftIcon={<Icons.Bag size={14} />}>Small Bag</Button>
                <Button size="md" rightIcon={<Icons.ArrowRight size={16} />}>Discover Fragrance</Button>
                <Button size="lg">Large Campaign CTA</Button>
                <Button size="icon" variant="outline" aria-label="Search">
                  <Icons.Search size={16} />
                </Button>
                <Button size="icon" variant="outline" aria-label="Wishlist">
                  <Icons.Heart size={16} />
                </Button>
              </div>
            </div>

            <div>
              <p className="text-caption text-foreground-subtle mb-3">Interactive States</p>
              <div className="flex flex-wrap gap-4 items-center">
                <Button isLoading>Processing</Button>
                <Button variant="outline" isLoading>Loading</Button>
                <Button disabled>Disabled Action</Button>
                <Button variant="secondary" disabled>Disabled Secondary</Button>
              </div>
            </div>
          </div>
        </section>

        <Divider variant="with-diamond" />

        {/* 4. Form Components & Input System */}
        <section className="mb-16">
          <h2 className="text-h2 font-serif mb-6">Form & Input System</h2>
          <div className="border border-border p-6 sm:p-8 bg-surface space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                placeholder="Eleanor Beaumont"
                helperText="Enter your name as it appears on your passport or ID."
              />
              <Input
                label="Email Address"
                placeholder="eleanor@maison.com"
                leftIcon={<Icons.User size={16} />}
              />
              <Input
                label="Card Number (Error State)"
                defaultValue="4242 •••• •••• 1234"
                error="The card expiration date is invalid."
              />
              <Input
                label="Disabled Input"
                disabled
                defaultValue="INV-2026-9481 (Locked)"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Fragrance Concentration"
                options={[
                  { label: "Extrait de Parfum (30% Concentration)", value: "extrait" },
                  { label: "Eau de Parfum (20% Concentration)", value: "edp" },
                  { label: "Eau de Toilette (12% Concentration)", value: "edt" },
                ]}
              />
              <Select
                label="Country / Region"
                error="Please select a supported shipping destination."
                options={[
                  { label: "Select destination...", value: "" },
                  { label: "United States (USD)", value: "us" },
                  { label: "France (EUR)", value: "fr" },
                  { label: "United Kingdom (GBP)", value: "uk" },
                ]}
              />
            </div>

            <Textarea
              label="Special Gift Inscription"
              placeholder="Enter complimentary calligraphy note to be included in the presentation box..."
              helperText="Maximum 150 characters."
            />

            <div className="pt-2 flex flex-wrap gap-6 items-center">
              <Checkbox
                label="Sign up for private reserve releases and private salon invitations"
                checked={checkboxVal}
                onChange={(e) => setCheckboxVal(e.target.checked)}
              />
            </div>

            <div className="pt-2 flex flex-wrap gap-6 items-center">
              <Radio
                label="Complimentary standard shipping (3-5 business days)"
                name="shippingOption"
                checked={radioVal === "option1"}
                onChange={() => setRadioVal("option1")}
              />
              <Radio
                label="White-glove courier delivery ($25.00)"
                name="shippingOption"
                checked={radioVal === "option2"}
                onChange={() => setRadioVal("option2")}
              />
            </div>
          </div>
        </section>

        <Divider variant="with-diamond" />

        {/* 5. Badges & Labels */}
        <section className="mb-16">
          <h2 className="text-h2 font-serif mb-6">Badges & Status Labels</h2>
          <div className="border border-border p-6 sm:p-8 bg-surface flex flex-wrap gap-3 items-center">
            <Badge variant="default">Standard</Badge>
            <Badge variant="outline">Best Seller</Badge>
            <Badge variant="accent">Limited Edition</Badge>
            <Badge variant="dark">Sold Out</Badge>
            <Badge variant="neutral">New Arrival</Badge>
            <Badge variant="success">In Stock</Badge>
            <Badge variant="warning">Low Stock</Badge>
            <Badge variant="error">Discontinued</Badge>
          </div>
        </section>

        <Divider variant="with-diamond" />

        {/* 6. Card System Primitives */}
        <section className="mb-16">
          <h2 className="text-h2 font-serif mb-6">Card System</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="default">
              <CardHeader>
                <p className="text-caption text-foreground-muted">Default Card</p>
                <CardTitle>Maison Heritage</CardTitle>
                <CardDescription>Handcrafted in limited batches in the heart of Provence.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-body-sm">
                  Rooted in two centuries of artisanal extraction and bespoke formulation.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm">Read Archive</Button>
              </CardFooter>
            </Card>

            <Card variant="subtle">
              <CardHeader>
                <p className="text-caption text-foreground-muted">Subtle Surface</p>
                <CardTitle>Private Salon</CardTitle>
                <CardDescription>One-on-one virtual consultations with our master perfumers.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-body-sm">
                  Discover notes attuned to your unique olfactory chemistry.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="primary" size="sm">Book Session</Button>
              </CardFooter>
            </Card>

            <Card variant="interactive">
              <CardHeader>
                <p className="text-caption text-accent">Interactive Card</p>
                <CardTitle>Discovery Set</CardTitle>
                <CardDescription>Five 5ml miniature flacons curated by season.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-body-sm">
                  Includes a redeemable voucher toward any full-sized 100ml bottle.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" rightIcon={<Icons.ArrowRight size={14} />}>Explore Set</Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        <Divider variant="with-diamond" />

        {/* 7. Product Visual Foundation */}
        <section className="mb-16">
          <h2 className="text-h2 font-serif mb-6">Product Visual Foundation</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <ProductCard
              product={sampleProduct}
              isWishlisted={isWishlisted}
              onWishlistToggle={() => setIsWishlisted(!isWishlisted)}
              onQuickAdd={(p, v) => alert(`Added ${p.title} (${v.size}) to cart`)}
            />
            {/* Out of Stock demonstration */}
            <ProductCard
              product={{
                ...sampleProduct,
                id: "prod-2",
                title: "Oud Royale",
                slug: "oud-royale",
                isLimitedEdition: false,
                variants: [{ id: "v-3", size: "100ml", price: 420, stock: 0, sku: "OR-100" }],
              }}
            />
            {/* New Arrival demonstration */}
            <ProductCard
              product={{
                ...sampleProduct,
                id: "prod-3",
                title: "Fleur Blanche",
                slug: "fleur-blanche",
                concentration: "Eau de Parfum",
                olfactoryFamily: "Solar Floral",
                isLimitedEdition: false,
                isNewArrival: true,
                variants: [
                  { id: "v-4", size: "50ml", price: 195, stock: 20, sku: "FB-50" },
                  { id: "v-5", size: "100ml", price: 285, stock: 15, sku: "FB-100" },
                ],
              }}
            />
            {/* Loading Skeleton */}
            <div className="flex flex-col space-y-3">
              <Skeleton className="aspect-[3/4] w-full" />
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </section>

        <Divider variant="with-diamond" />

        {/* 8. Modal & Drawer Foundation */}
        <section className="mb-16">
          <h2 className="text-h2 font-serif mb-6">Overlay, Modal & Drawer Foundation</h2>
          <div className="border border-border p-6 sm:p-8 bg-surface flex flex-wrap gap-4 items-center">
            <Button variant="primary" onClick={() => setIsModalOpen(true)}>
              Open Luxury Modal
            </Button>
            <Button variant="outline" onClick={() => setIsDrawerOpen(true)}>
              Open Cart Drawer
            </Button>
            <Button variant="danger" onClick={() => setIsConfirmOpen(true)}>
              Open Confirm Dialog
            </Button>

            <Dropdown
              trigger={
                <Button variant="secondary" rightIcon={<Icons.ChevronDown size={14} />}>
                  Sort & Filter
                </Button>
              }
            >
              <div className="py-1">
                <button type="button" className="w-full text-left px-4 py-2 text-xs uppercase tracking-wider text-foreground hover:bg-surface-subtle font-sans">
                  Featured
                </button>
                <button type="button" className="w-full text-left px-4 py-2 text-xs uppercase tracking-wider text-foreground hover:bg-surface-subtle font-sans">
                  Price: Low to High
                </button>
                <button type="button" className="w-full text-left px-4 py-2 text-xs uppercase tracking-wider text-foreground hover:bg-surface-subtle font-sans">
                  Price: High to Low
                </button>
              </div>
            </Dropdown>
          </div>

          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Bespoke Consultation"
            description="Our fragrance advisors will guide you through custom composition."
          >
            <div className="space-y-4">
              <Input label="Preferred Scent Notes" placeholder="e.g. Amber, Frankincense, Neroli" />
              <Select
                label="Desired Bottle Size"
                options={[
                  { label: "50ml Flacon", value: "50" },
                  { label: "100ml Flacon", value: "100" },
                  { label: "250ml Carafe", value: "250" },
                ]}
              />
              <div className="pt-4 flex justify-end gap-3">
                <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={() => setIsModalOpen(false)}>
                  Request Consultation
                </Button>
              </div>
            </div>
          </Modal>

          <Drawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            title="Shopping Bag"
            description="1 Item"
            footer={
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="font-sans uppercase text-xs tracking-wider text-foreground-muted">Subtotal</span>
                  <span className="font-serif text-base text-foreground">$240.00</span>
                </div>
                <Button variant="primary" size="lg" className="w-full">
                  Proceed to Checkout
                </Button>
              </div>
            }
          >
            <div className="p-4 border border-border bg-surface flex gap-4">
              <div className="h-16 w-16 bg-surface-subtle border border-border flex items-center justify-center flex-shrink-0">
                <Icons.Package size={24} className="text-foreground-subtle" />
              </div>
              <div className="flex-1">
                <h4 className="font-serif text-sm font-normal">Santal Impérial</h4>
                <p className="text-[11px] text-foreground-muted">50ml • Extrait de Parfum</p>
                <p className="font-serif text-xs mt-1">$240.00</p>
              </div>
            </div>
          </Drawer>

          <ConfirmDialog
            isOpen={isConfirmOpen}
            onClose={() => setIsConfirmOpen(false)}
            onConfirm={() => setIsConfirmOpen(false)}
            title="Archive Product"
            message="Are you sure you want to archive this product? It will no longer appear on the live storefront."
            confirmLabel="Archive"
            isDestructive
          />
        </section>

        <Divider variant="with-diamond" />

        {/* 9. Pagination */}
        <section className="mb-16">
          <h2 className="text-h2 font-serif mb-6">Pagination Controls</h2>
          <div className="border border-border p-6 bg-surface">
            <Pagination
              currentPage={currentPage}
              totalPages={8}
              onPageChange={(p) => setCurrentPage(p)}
            />
          </div>
        </section>

        <Divider variant="with-diamond" />

        {/* 10. Admin Design Tokens & Components */}
        <section className="mb-16">
          <h2 className="text-h2 font-serif mb-6">Admin Design System Foundation</h2>

          {/* Metric Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatsCard
              title="Total Revenue (MTD)"
              value="$128,450"
              change="+14.2%"
              changeType="positive"
              description="vs last month"
              icon={<Icons.Dollar size={20} />}
            />
            <StatsCard
              title="Active Perfume Orders"
              value="84"
              change="+6.8%"
              changeType="positive"
              description="all dispatched today"
              icon={<Icons.Delivery size={20} />}
            />
            <StatsCard
              title="Low Stock Alerts"
              value="3"
              change="Action Required"
              changeType="negative"
              description="Under 5 units remaining"
              icon={<Icons.AlertCircle size={20} />}
            />
          </div>

          {/* Admin Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg">Recent Customer Orders</h3>
              <div className="flex gap-2">
                <StatusBadge status="processing" />
                <StatusBadge status="delivered" />
                <StatusBadge status="pending" />
              </div>
            </div>
            <DataTable<SampleAdminRow>
              columns={[
                { header: "Order ID", accessorKey: "orderNumber" },
                { header: "Customer", accessorKey: "customer" },
                { header: "Date", accessorKey: "date" },
                {
                  header: "Status",
                  cell: (row) => <StatusBadge status={row.status} />,
                },
                {
                  header: "Amount",
                  accessorKey: "total",
                  align: "right",
                  className: "font-medium",
                },
              ]}
              data={sampleAdminData}
            />
          </div>
        </section>

        {/* Loading Spinner Foundation */}
        <section className="mb-16">
          <h2 className="text-h2 font-serif mb-6">Loading Primitives</h2>
          <div className="border border-border p-6 bg-surface flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <Spinner size="xs" />
              <span className="text-xs text-foreground-muted">XS (14px)</span>
            </div>
            <div className="flex items-center space-x-2">
              <Spinner size="sm" />
              <span className="text-xs text-foreground-muted">SM (16px)</span>
            </div>
            <div className="flex items-center space-x-2">
              <Spinner size="md" />
              <span className="text-xs text-foreground-muted">MD (20px)</span>
            </div>
            <div className="flex items-center space-x-2">
              <Spinner size="lg" />
              <span className="text-xs text-foreground-muted">LG (32px)</span>
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}
