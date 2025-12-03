using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class FixBookingNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_AvailableDays_AvailableDayId",
                table: "Bookings");

            migrationBuilder.AlterColumn<int>(
                name: "AvailableDayId",
                table: "Bookings",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_AvailableDays_AvailableDayId",
                table: "Bookings",
                column: "AvailableDayId",
                principalTable: "AvailableDays",
                principalColumn: "AvailableDayId",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_AvailableDays_AvailableDayId",
                table: "Bookings");

            migrationBuilder.AlterColumn<int>(
                name: "AvailableDayId",
                table: "Bookings",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_AvailableDays_AvailableDayId",
                table: "Bookings",
                column: "AvailableDayId",
                principalTable: "AvailableDays",
                principalColumn: "AvailableDayId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
