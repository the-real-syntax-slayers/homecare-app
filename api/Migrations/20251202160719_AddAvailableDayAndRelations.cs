using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AddAvailableDayAndRelations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AvailableDayId",
                table: "Bookings",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "AvailableDays",
                columns: table => new
                {
                    AvailableDayId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Date = table.Column<DateTime>(type: "TEXT", nullable: false),
                    EmployeeId = table.Column<int>(type: "INTEGER", nullable: false),
                    Notes = table.Column<string>(type: "TEXT", maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AvailableDays", x => x.AvailableDayId);
                    table.ForeignKey(
                        name: "FK_AvailableDays_Employees_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "Employees",
                        principalColumn: "EmployeeId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_AvailableDayId",
                table: "Bookings",
                column: "AvailableDayId");

            migrationBuilder.CreateIndex(
                name: "IX_AvailableDays_EmployeeId",
                table: "AvailableDays",
                column: "EmployeeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_AvailableDays_AvailableDayId",
                table: "Bookings",
                column: "AvailableDayId",
                principalTable: "AvailableDays",
                principalColumn: "AvailableDayId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_AvailableDays_AvailableDayId",
                table: "Bookings");

            migrationBuilder.DropTable(
                name: "AvailableDays");

            migrationBuilder.DropIndex(
                name: "IX_Bookings_AvailableDayId",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "AvailableDayId",
                table: "Bookings");
        }
    }
}
